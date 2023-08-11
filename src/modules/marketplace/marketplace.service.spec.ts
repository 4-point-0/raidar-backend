import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MarketplaceService } from './marketplace.service';
import { Song } from '../song/song.entity';
import { Provider, Role } from '../../common/enums/enum';
import { SongFiltersDto } from './dto/songs.filter.dto';
import * as MarketplaceQueries from './queries/marketplace.queries';
import { User } from '../user/user.entity';
import { Album } from '../album/album.entity';
import { File } from '../file/file.entity';
import { Licence } from '../licence/licence.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

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

      const mockUser = Object.assign(new User(), {
        id: '1',
        email: 'testuser@test.com',
        first_name: 'Test',
        last_name: 'User',
        roles: [Role.User],
        provider: Provider.Google,
        provider_id: 'testusergoogleid',
        wallet_address: '0x123456789',
        created_at: new Date('2020-01-01T00:00:00Z'),
        updated_at: new Date('2020-01-01T00:00:00Z'),
      });

      const mockSongs: Song[] = [
        Object.assign(new Song(), {
          id: '1',
          title: 'Test song 1',
          user: mockUser,
          album: Object.assign(new Album(), {
            id: '1',
            title: 'Test album 1',
            cover: Object.assign(new File(), {
              id: '1',
              name: 'Test cover file 1',
              mime_type: 'image/png',
              url: 'http://example.com/cover1.png',
              key: 'cover1',
              url_expiry: new Date('2025-01-01T00:00:00Z'),
            }),
            pka: 'Test album 1 pka',
          }),
          length: 300,
          genre: 'Rock',
          mood: ['Happy'],
          tags: ['Tag1'],
          bpm: 120,
          instrumental: false,
          languages: ['English'],
          vocal_ranges: ['High'],
          musical_key: 'C',
          music: Object.assign(new File(), {
            id: '1',
            name: 'Test music file 1',
            mime_type: 'audio/mpeg',
            url: 'http://example.com/music1.mp3',
            key: 'music1',
            url_expiry: new Date('2025-01-01T00:00:00Z'),
          }),
          recording_date: new Date('2020-01-01T00:00:00Z'),
          recording_country: 'USA',
          recording_location: 'Los Angeles',
          art: Object.assign(new File(), {
            id: '1',
            name: 'Test art file 1',
            mime_type: 'image/png',
            url: 'http://example.com/art1.png',
            key: 'art1',
            url_expiry: new Date('2025-01-01T00:00:00Z'),
          }),
          pka: 'Test song 1 pka',
          licences: [
            Object.assign(new Licence(), {
              id: '1',
              seller: mockUser,
              buyer: mockUser,
              tx_hash: 'Test tx hash 1',
              price: 10.0,
            }),
          ],
        }),
      ];

      const mockQueryResult = { songs: mockSongs, count: mockSongs.length };

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
