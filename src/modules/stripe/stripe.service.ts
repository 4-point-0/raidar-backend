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
  ) {
    this.stripe = new Stripe(this.configService.get('stripe.api_key'), {
      apiVersion: this.configService.get('stripe.api_version'),
    });
  }

  async createPrice(amount: number): Promise<Stripe.Price> {
    try {
      const price = await this.stripe.prices.create({
        unit_amount: amount * 100,
        currency: 'usd',
        product: 'prod_generic_song',
      });
      return price;
    } catch (error) {
      this.logger.error('StripeService - createPrice', error);
      return null;
    }
  }

  async createCheckoutSession(
    songId: string,
    userId: string,
    priceId: string,
  ): Promise<ServiceResult<Stripe.Checkout.Session>> {
    try {
      //TODO UPDATE THE SUCCESS AND CANCEL URL
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{ price: priceId, quantity: 1 }],
        metadata: { songId, userId },
        mode: 'payment',
        success_url: 'raidar.us',
        cancel_url: 'raidar.us',
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

    if (event.type === 'charge.refunded') {
      return await this.chargeRefunded(event.data.object.invoice);
    }

    return new ServiceResult<boolean>(true);
  }

  async checkoutSessionCompleted(
    session: any,
  ): Promise<ServiceResult<boolean>> {
    try {
      if (!session.client_reference_id) {
        return new BadRequest<boolean>(`User not found!`);
      }

      const user_id = session.client_reference_id;

      const user = await this.userRepository.findOne({ where: user_id });
      if (!user) {
        return new NotFound<boolean>(`User not found!`);
      }

      let invoice_pdf = '';
      if (session.invoice) {
        const invoice = await this.stripe.invoices.retrieve(session.invoice);

        if (invoice) {
          invoice_pdf = invoice.invoice_pdf;
        }
      }
      const song = await this.songRepository.findOne({
        where: { id: session.songId },
      });

      if (!song) {
        return new NotFound<boolean>(`Song not found`);
      }

      const buyer = await this.userRepository.findOne({
        where: { id: session.userId },
      });

      if (!buyer) {
        return new NotFound<boolean>(`Buyer not found!`);
      }

      const existingLicence = await this.licenceRepository.findOne({
        where: { song: { id: song.id }, buyer: { id: buyer.id } },
      });

      if (existingLicence) {
        return new BadRequest<boolean>(
          `Buyer already owns a licence for this song!`,
        );
      }

      const seller = await this.userRepository.findOne({
        where: { id: song.user.id },
      });

      if (!seller) {
        return new NotFound<boolean>(`Seller not found!`);
      }

      const licence = this.licenceRepository.create();
      licence.song = song;
      licence.seller = seller;
      licence.buyer = buyer;
      licence.invoiceId = session.invoice.id;

      const near_usd = await this.cacheManager.get<string>('near-usd');
      licence.sold_price = nearAPI.utils.format.parseNearAmount(
        (song.price / Number(near_usd)).toString(),
      );

      await this.licenceRepository.save(licence);

      //TODO Email sa invoice-om

      return new ServiceResult<boolean>(true);
    } catch (error) {
      this.logger.error('StripeService - checkoutSessionCompleted', error);
      return new ServerError<boolean>(`Checkout session completed error`);
    }
  }

  private async chargeRefunded(
    invoice_id: string,
  ): Promise<ServiceResult<boolean>> {
    try {
      const licence = await this.licenceRepository.findOne({
        where: { invoiceId: invoice_id },
      });

      if (!licence) {
        this.logger.error('No licence found for the given invoice ID');
        return new NotFound<boolean>(
          'Licence not found for the given invoice ID',
        );
      }

      await this.licenceRepository.remove(licence);

      return new ServiceResult<boolean>(true);
    } catch (error) {
      this.logger.error('StripeService - handleChargeRefunded', error);
      throw new Error(`Charge Refunded Error: ${error.message}`);
    }
  }
}
