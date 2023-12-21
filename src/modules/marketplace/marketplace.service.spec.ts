import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MarketplaceService } from './marketplace.service';
import { Song } from '../song/song.entity';
import { Role } from '../../common/enums/enum';
import { SongFiltersDto } from './dto/songs.filter.dto';
import * as MarketplaceQueries from './queries/marketplace.queries';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CoingeckoService } from '../coingecko/coingecko.service';
import { ConfigService } from '@nestjs/config';
import { song_list } from '../../../test/mock-data';

describe('MarketplaceService', () => {
  let service: MarketplaceService;
  let songRepo: Repository<Song>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarketplaceService,
        {
          provide: getRepositoryToken(Song),
          useClass: Repository,
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'near-usd') {
                return 1.5;
              }
              return null;
            }),
          },
        },
        {
          provide: CoingeckoService,
          useValue: {
            getCurrentNearPrice: jest.fn().mockResolvedValue(1),
            convertNearToUsd: jest.fn().mockResolvedValue(1),
            convertUsdToNear: jest.fn().mockResolvedValue(1),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'sengrid.email') {
                return '123';
              }

              if (key === 'sendgrid.api_key') {
                return '123';
              }
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<MarketplaceService>(MarketplaceService);
    songRepo = module.get<Repository<Song>>(getRepositoryToken(Song));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return BadRequest error if roles do not include Artist or User', async () => {
      const roles = [Role.Admin];
      const filters = new SongFiltersDto();

      try {
        await service.findAll(roles, filters);
      } catch (error) {
        expect(error.response).toBe(
          `You don't have permission for this operation!`,
        );
      }
    });

    it('should return songs', async () => {
      const roles = [Role.Artist];
      const filters = new SongFiltersDto();

      const mockQueryResult = { songs: song_list, count: song_list.length };

      jest
        .spyOn(MarketplaceQueries, 'findAllMarketplaceArtistSongs')
        .mockImplementation(() => Promise.resolve(mockQueryResult));

      const response = await service.findAll(roles, filters);
      expect(response.data.results.length).toBe(1);
    });

    it('should handle error and return ServerError', async () => {
      const roles = [Role.Artist];
      const filters = new SongFiltersDto();

      jest.spyOn(songRepo, 'createQueryBuilder').mockImplementation(() => {
        throw new Error();
      });

      try {
        await service.findAll(roles, filters);
      } catch (error) {
        expect(error.response).toBe(`Can't get artist songs`);
      }
    });
  });
});
