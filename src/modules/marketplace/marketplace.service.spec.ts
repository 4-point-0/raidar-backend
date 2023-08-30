import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MarketplaceService } from './marketplace.service';
import { Song } from '../song/song.entity';
import { Role } from '../../common/enums/enum';
import { SongFiltersDto } from './dto/songs.filter.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { array_songs } from '../../../test/mock-data';
import { buildAlgoliaQueryForSongs } from './queries/marketplace.queries';
import { mapSongToAlgoliaRecord } from '../song/mappers/algolia.mapper';

describe('MarketplaceService', () => {
  let service: MarketplaceService;
  let songRepo: Repository<Song>;

  const algoliaRecords = array_songs.map((song) =>
    mapSongToAlgoliaRecord(song),
  );

  const mockAlgoliaResult = {
    hits: algoliaRecords,
    nbHits: algoliaRecords.length,
  };

  const algoliaClientSongsMock = {
    indexRecord: jest.fn(),
    indexMultipleRecords: jest.fn(),
    search: jest.fn().mockReturnValue(mockAlgoliaResult),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarketplaceService,
        {
          provide: getRepositoryToken(Song),
          useValue: {
            find: jest.fn().mockReturnValue(array_songs),
            createQueryBuilder: jest.fn().mockReturnThis(),
          },
        },
        {
          provide: `AlgoliaClient_songs`,
          useValue: algoliaClientSongsMock,
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

      const expectedAlgoliaQuery = {
        ...buildAlgoliaQueryForSongs(filters),
        restrictSearchableAttributes: ['title', 'artist', 'musical_key'],
      };

      const response = await service.findAll(roles, filters);

      expect(algoliaClientSongsMock.search).toHaveBeenCalledWith(
        '',
        expectedAlgoliaQuery,
      );
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
