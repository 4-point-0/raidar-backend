import { Test, TestingModule } from '@nestjs/testing';
import { CoingeckoService } from './coingecko.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

describe('CoingeckoService', () => {
  let service: CoingeckoService;
  let httpService: HttpService;
  let mockCacheManager: { get: jest.Mock; set: jest.Mock };

  beforeEach(async () => {
    mockCacheManager = {
      get: jest.fn(),
      set: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule],
      providers: [
        CoingeckoService,
        {
          provide: 'CACHE_MANAGER',
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    service = module.get<CoingeckoService>(CoingeckoService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get current near price', async () => {
    const price = '5';
    mockCacheManager.get.mockResolvedValue(price);
    expect(await service.getCurrentNearPrice()).toEqual({
      data: Number(price),
      error: undefined,
    });
  });

  it('should set near price', async () => {
    const price = 5;
    mockCacheManager.set.mockResolvedValue(undefined);
    mockCacheManager.get.mockResolvedValue(price.toString());
    expect(await service.setNearPrice(price)).toEqual({
      data: price,
      error: undefined,
    });
  });

  it('should set near coingecko price', async () => {
    const price = 5;
    const axiosResult = { data: { near: { usd: price } } };
    jest.spyOn(httpService.axiosRef, 'get').mockResolvedValue(axiosResult);
    mockCacheManager.set.mockResolvedValue(undefined);
    expect(await service.setNearCoingeckoPrice()).toEqual({
      data: price,
      error: undefined,
    });
  });

  it('should get storage prices in USD and NEAR', async () => {
    const nearPriceInUsd = '5';
    const storagePriceInUsd = 0.00123;
    const expectedNearStoragePrice = storagePriceInUsd / Number(nearPriceInUsd);

    mockCacheManager.get.mockResolvedValue(nearPriceInUsd);
    jest
      .spyOn(service['configService'], 'get')
      .mockReturnValue(storagePriceInUsd);

    const result = await service.getStoragePrices();

    expect(result).toEqual({
      data: {
        nearPrice: expectedNearStoragePrice,
        usdPrice: storagePriceInUsd,
      },
      error: undefined,
    });
  });

  it('should return an error if NEAR price is not set', async () => {
    mockCacheManager.get.mockResolvedValue(undefined);

    const result = await service.getStoragePrices();

    expect(result.data).toBeNull();
    expect(result.error.message).toEqual('Near price not set');
  });
});
