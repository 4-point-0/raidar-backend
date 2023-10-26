import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { NearDto } from './dto/near.dto';
import { NEAR_PRICE_USD_COINGECKO_URL } from '../../common/constants';
import { ServiceResult } from '../../helpers/response/result';
import { BadRequest, ServerError } from '../../helpers/response/errors';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CoingeckoService {
  private readonly logger = new Logger(CoingeckoService.name);

  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService,
  ) {}

  async getCurrentNearPrice(): Promise<ServiceResult<number>> {
    try {
      const near_usd = await this.cacheManager.get<string>('near-usd');

      if (!near_usd) {
        return new BadRequest<number>(`Near price not set`);
      }
      return new ServiceResult<number>(Number(near_usd));
    } catch (error) {
      this.logger.error('CoingeckoService - setNearPrice', error);
      return new ServerError<number>(`Can't set near price`);
    }
  }

  async getStoragePrices(): Promise<
    ServiceResult<{ nearPrice: number; usdPrice: number }>
  > {
    try {
      const near_usd = await this.cacheManager.get<string>('near-usd');

      if (!near_usd) {
        return new BadRequest(`Near price not set`);
      }

      const storage_cost_usd =
        this.configService.get<number>('storage_cost_usd');
      const nearPrice = storage_cost_usd / Number(near_usd);

      return new ServiceResult({
        nearPrice: nearPrice,
        usdPrice: storage_cost_usd,
      });
    } catch (error) {
      this.logger.error('CoingeckoService - getStoragePrices', error);
      return new ServerError(`Can't get storage prices`);
    }
  }
  async convertNearToUsd(amountInNear: number): Promise<number> {
    const near_usd = await this.getCurrentNearPrice();
    if (!near_usd) {
      throw new ServerError<number>('Failed to get current NEAR price.');
    }
    return amountInNear * near_usd.data;
  }

  async convertUsdToNear(amountInUsd: number): Promise<number> {
    const near_usd = await this.getCurrentNearPrice();
    if (!near_usd) {
      throw new ServerError<number>('Failed to get current NEAR price.');
    }
    return amountInUsd / near_usd.data;
  }

  async setNearPrice(price: number): Promise<ServiceResult<number>> {
    try {
      await this.cacheManager.set('near-usd', price.toString(), 0);
      const near_usd = await this.cacheManager.get<string>('near-usd');

      if (!near_usd) {
        return new BadRequest<number>(`Near price not set`);
      }
      return new ServiceResult<number>(Number(near_usd));
    } catch (error) {
      this.logger.error('CoingeckoService - setNearPrice', error);
      return new ServerError<number>(`Can't set near price`);
    }
  }

  async setNearCoingeckoPrice(): Promise<ServiceResult<number>> {
    let near_usd = null;
    try {
      const { data } = await this.httpService.axiosRef.get<NearDto>(
        NEAR_PRICE_USD_COINGECKO_URL,
      );
      if (data && data.near && data.near.usd) {
        await this.cacheManager.set('near-usd', data.near.usd.toString(), 0);
        near_usd = data.near.usd;
      }

      if (!near_usd) {
        return new BadRequest<number>(`Near price not set`);
      }

      return new ServiceResult<number>(near_usd);
    } catch (error) {
      this.logger.error('CoingeckoService - setNearCoingeckoPrice', error);
      return new ServerError<number>(`Can't get near price from coingecko`);
    }
  }

  @Cron(CronExpression.EVERY_10_MINUTES, {
    name: 'setNearCoingeckoPriceCron',
  })
  async setNearCoingeckoPriceCron(): Promise<void> {
    await this.setNearCoingeckoPrice();
    this.logger.warn(
      `job setNearCoingeckoPriceCron finished ${new Date().toString()}`,
    );
  }
}
