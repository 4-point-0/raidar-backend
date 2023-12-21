import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Song } from '../song/song.entity';
import { ServiceResult } from '../../helpers/response/result';
import {
  BadRequest,
  NotFound,
  ServerError,
} from '../../helpers/response/errors';
import { User } from '../user/user.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { Licence } from '../licence/licence.entity';
import { EmailService } from '../email/email.service';
import { songBoughtTemplate } from '../../common/email-templates/song-bought-notif-template';
import { songDownloadTemplate } from '../../common/email-templates/song-dowload-template';
import { invoiceLinkTemplate } from '../../common/email-templates/invoice-template';
import { findSongWithUser } from '../song/queries/song.queries';
import { NearProviderService } from '../near-provider/near-provider.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const nearAPI = require('near-api-js');

@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name);
  private stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
    @InjectRepository(Licence)
    private licenceRepository: Repository<Licence>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly emailService: EmailService,
    private readonly nearProviderService: NearProviderService,
  ) {
    this.stripe = new Stripe(this.configService.get('stripe.api_key'), {
      apiVersion: this.configService.get('stripe.api_version'),
    });
  }

  async createPrice(amount: number): Promise<Stripe.Price> {
    try {
      const price = await this.stripe.prices.create({
        unit_amount: Math.round(amount * 100),
        currency: 'usd',
        product: this.configService.get('stripe.base_product'),
      });
      return price;
    } catch (error) {
      this.logger.error('StripeService - createPrice', error);
      return null;
    }
  }

  async createCheckoutSession(
    song_id: string,
    user_id: string,
  ): Promise<ServiceResult<Stripe.Checkout.Session>> {
    try {
      const songQuery = findSongWithUser(song_id);
      const song = await this.songRepository.findOne(songQuery);

      if (!song) {
        return new NotFound<Stripe.Checkout.Session>(`Song not found`);
      }

      const user = await this.userRepository.findOne({
        where: { id: user_id },
      });
      if (!user) {
        return new NotFound<Stripe.Checkout.Session>(`User not found!`);
      }

      const existingLicence = await this.licenceRepository.findOne({
        where: { song: { id: song.id }, buyer: { id: user.id } },
      });

      if (existingLicence) {
        return new BadRequest<Stripe.Checkout.Session>(
          `Buyer already owns a licence for this song!`,
        );
      }

      const seller = await this.userRepository.findOne({
        where: { id: song.user.id },
      });

      if (!seller) {
        return new NotFound<Stripe.Checkout.Session>(`Seller not found!`);
      }

      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{ price: song.price_id, quantity: 1 }],
        metadata: { song_id, user_id },
        mode: 'payment',
        success_url: this.configService.get('stripe.success_url'),
        cancel_url: this.configService.get('stripe.error_url'),
        invoice_creation: {
          enabled: true,
        },
      });
      return new ServiceResult<Stripe.Checkout.Session>(session);
    } catch (error) {
      this.logger.error('StripeService - createCheckoutSession', error);
      return new ServerError<Stripe.Checkout.Session>(
        `Can't create checkout session`,
      );
    }
  }

  public async constructEventFromPayload(
    signature: string | string[],
    payload: Buffer,
  ) {
    try {
      const webhookSecret = this.configService.get('stripe.webhook_secret');
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret,
      );
      return await this.stripeWebhook(event);
    } catch (error) {
      this.logger.error(
        'StripeWebhook - constructEventFromPayload',
        error.message,
      );
      throw new Error(`Webhook Error: ${error.message}`);
    }
  }

  async stripeWebhook(event: any): Promise<ServiceResult<boolean>> {
    if (event.type === 'checkout.session.completed') {
      return await this.checkoutSessionCompleted(event.data.object);
    }
    return new ServiceResult<boolean>(true);
  }

  async checkoutSessionCompleted(
    session: any,
  ): Promise<ServiceResult<boolean>> {
    try {
      let invoice_pdf = '';
      if (session.invoice) {
        const invoice = await this.stripe.invoices.retrieve(session.invoice);

        if (invoice) {
          invoice_pdf = invoice.invoice_pdf;
        }
      }
      const songQuery = findSongWithUser(session.metadata.song_id);
      const song = await this.songRepository.findOne(songQuery);

      if (!song) {
        return new NotFound<boolean>(`Song not found`);
      }

      const buyer = await this.userRepository.findOne({
        where: { id: session.metadata.user_id },
      });

      const isBoughtOnNear = await this.nearProviderService.buyForUser(
        song.token_contract_id.toString(),
        buyer.id,
      );

      if (!isBoughtOnNear) {
        return new ServerError<boolean>(`Failed to buy song on NEAR`);
      }

      const seller = await this.userRepository.findOne({
        where: { id: song.user.id },
      });

      const licence = this.licenceRepository.create();
      licence.song = song;
      licence.seller = seller;
      licence.buyer = buyer;
      licence.invoice_id = session.invoice;

      const near_usd = await this.cacheManager.get<string>('near-usd');
      licence.sold_price = nearAPI.utils.format.parseNearAmount(
        (song.price / Number(near_usd)).toString(),
      );

      await this.licenceRepository.save(licence);

      await this.emailService.send({
        to: seller.email,
        from: this.configService.get('sendgrid.email'),
        subject: 'Your Song Has Been Sold',
        html: songBoughtTemplate(song.title),
      });

      await this.emailService.send({
        to: buyer.email,
        from: this.configService.get('sendgrid.email'),
        subject: 'Download Your Raidar Song',
        html: songDownloadTemplate(song.title, song.music.url),
      });

      await this.emailService.send({
        to: buyer.email,
        from: this.configService.get('sendgrid.email'),
        subject: 'Your Raidar Invoice',
        html: invoiceLinkTemplate(invoice_pdf),
      });

      return new ServiceResult<boolean>(true);
    } catch (error) {
      this.logger.error('StripeService - checkoutSessionCompleted', error);
      return new ServerError<boolean>(`Checkout session completed error`);
    }
  }
}
