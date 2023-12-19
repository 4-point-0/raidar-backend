import { Test, TestingModule } from '@nestjs/testing';
import { SongService } from './song.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Song } from './song.entity';
import { File } from '../file/file.entity';
import { User } from '../user/user.entity';
import { Album } from '../album/album.entity';
import { Licence } from '../licence/licence.entity';
import { Repository } from 'typeorm';
import {
  album_1,
  song_1,
  song_licence_1,
  user_artist_1,
} from '../../../test/mock-data';
import { BadRequest, NotFound } from '../../helpers/response/errors';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BuySongDto } from './dto/buy-song.dto';
import { LicenceDto } from '../licence/dto/licence.dto';
import { ServiceResult } from '../../helpers/response/result';
import { EmailService } from '../email/email.service';
import { ConfigService } from '@nestjs/config';
import { CoingeckoService } from '../coingecko/coingecko.service';
import { StripeService } from '../stripe/stripe.service';

describe('SongService', () => {
  let songService: SongService;
  let songRepository: Repository<Song>;
  let fileRepository: Repository<File>;
  let userRepository: Repository<User>;
  let albumRepository: Repository<Album>;
  let licenceRepository: Repository<Licence>;

  const SONG_REPOSITORY_TOKEN = getRepositoryToken(Song);
  const FILE_REPOSITORY_TOKEN = getRepositoryToken(File);
  const USER_REPOSITORY_TOKEN = getRepositoryToken(User);
  const ALBUM_REPOSITORY_TOKEN = getRepositoryToken(Album);
  const LICENCE_REPOSITORY_TOKEN = getRepositoryToken(Licence);

  const create_song_dto = {
    title: song_1.title,
    pka: song_1.pka,
    music_id: song_1.music.id,
    art_id: song_1.art.id,
    album_id: song_1.album.id,
    bpm: song_1.bpm,
    genre: song_1.genre,
    instrumental: song_1.instrumental,
    mood: song_1.mood,
    price: song_1.price,
    languages: song_1.languages,
    tags: song_1.tags,
    length: song_1.length,
    musical_key: song_1.musical_key,
    recording_country: song_1.recording_country,
    recording_date: song_1.recording_date,
    recording_location: song_1.recording_location,
    vocal_ranges: song_1.vocal_ranges,
    user_id: song_1.user.id,
    roles: song_1.user.roles,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SongService,
        {
          provide: SONG_REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn().mockResolvedValue(song_1),
            save: jest.fn().mockResolvedValue(song_1),
            findOne: jest.fn().mockResolvedValue(song_1),
            findAndCount: jest.fn().mockResolvedValue([[song_1], 1]),
          },
        },
        {
          provide: FILE_REPOSITORY_TOKEN,
          useValue: {
            findOneBy: jest.fn().mockResolvedValue(song_1.music),
          },
        },
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: {
            findOne: jest.fn().mockResolvedValue(song_1.user),
            findOneBy: jest.fn().mockResolvedValue(song_1.user),
          },
        },
        {
          provide: ALBUM_REPOSITORY_TOKEN,
          useValue: {
            findOneBy: jest.fn().mockResolvedValue(album_1),
          },
        },
        {
          provide: CoingeckoService,
          useValue: {
            getCurrentNearPrice: jest.fn().mockResolvedValue(1),
            convertNearToUsd: jest.fn(),
            convertUsdToNear: jest.fn(),
          },
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
          provide: LICENCE_REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn().mockResolvedValue(song_1.licences[0]),
            save: jest.fn().mockResolvedValue(song_1.licences[0]),
            findOneBy: jest.fn().mockResolvedValue(song_1.licences[0]),
            findOne: jest.fn(),
          },
        },
        {
          provide: EmailService,
          useValue: {
            send: jest.fn().mockReturnValue(true),
          },
        },
        {
          provide: StripeService,
          useValue: {
            createPrice: jest.fn().mockReturnValue('1'),
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

    songService = module.get<SongService>(SongService);
    songRepository = module.get<Repository<Song>>(SONG_REPOSITORY_TOKEN);
    fileRepository = module.get<Repository<File>>(FILE_REPOSITORY_TOKEN);
    userRepository = module.get<Repository<User>>(USER_REPOSITORY_TOKEN);
    albumRepository = module.get<Repository<Album>>(ALBUM_REPOSITORY_TOKEN);
    licenceRepository = module.get<Repository<Licence>>(
      LICENCE_REPOSITORY_TOKEN,
    );
  });

  it('should be defined', () => {
    expect(songService).toBeDefined();
  });

  it('repositories should be defined', () => {
    expect(songRepository).toBeDefined();
    expect(fileRepository).toBeDefined();
    expect(userRepository).toBeDefined();
    expect(albumRepository).toBeDefined();
    expect(licenceRepository).toBeDefined();
  });

  describe('createSong', () => {
    it('should create a song successfully', async () => {
      const result = await songService.createSong(create_song_dto);
      expect(result).toBeDefined();
      expect(songRepository.create).toHaveBeenCalledWith(expect.any(Object));
      expect(songRepository.save).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a song by id', async () => {
      const songId = song_1.id;
      const result = await songService.findOne(songId, create_song_dto.roles);
      expect(result).toBeDefined();
      expect(songRepository.findOne).toHaveBeenCalled();
    });

    it('should return a NotFound error if song not found', async () => {
      const songId = 'wrongSongId';
      songRepository.findOne = jest.fn().mockResolvedValue(null);
      const result = await songService.findOne(songId, create_song_dto.roles);
      expect(result).toBeInstanceOf(NotFound);
      expect(result.error.message).toEqual('Song not found!');
    });
  });

  describe('findAllArtistSongs', () => {
    it('should return all songs of an artist', async () => {
      songRepository.findAndCount = jest.fn().mockResolvedValue([[song_1], 1]);
      const result = await songService.findAllArtistSongs(
        create_song_dto.user_id,
        create_song_dto.roles,
        {},
      );
      expect(result).toBeDefined();
      expect(songRepository.findAndCount).toHaveBeenCalled();
    });
  });

  describe('findAllUserSongs', () => {
    it('should return all songs of a user', async () => {
      songRepository.findAndCount = jest.fn().mockResolvedValue([[song_1], 1]);
      const result = await songService.findAllUserSongs(
        create_song_dto.user_id,
        create_song_dto.roles,
        {},
      );
      expect(result).toBeDefined();
      expect(songRepository.findAndCount).toHaveBeenCalled();
    });
  });

  describe('buySong', () => {
    it('should return ServerError error if song is not found', async () => {
      jest.spyOn(songRepository, 'findOne').mockResolvedValue(null);
      const dto: BuySongDto = {
        songId: 'nonExistentSongId',
        buyerId: 'buyerId',
        txHash: 'txHash',
      };
      const result = await songService.buySong(dto);
      expect(result).toBeInstanceOf(NotFound);
      expect(result.error.message).toEqual('Song not found');
    });

    it('should return NotFound error if buyer is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      const dto: BuySongDto = {
        songId: song_1.id,
        buyerId: 'nonExistentBuyerId',
        txHash: 'txHash',
      };
      const result = await songService.buySong(dto);
      expect(result).toBeInstanceOf(NotFound);
      expect(result.error.message).toEqual('Buyer not found!');
    });

    it('should return BadRequest error if buyer already owns a license', async () => {
      const dto: BuySongDto = {
        songId: song_1.id,
        buyerId: user_artist_1.id,
        txHash: 'txHash',
      };
      licenceRepository.findOne = jest.fn().mockResolvedValue(song_licence_1);
      const result = await songService.buySong(dto);
      expect(result).toBeInstanceOf(BadRequest);
      expect(result.error.message).toEqual(
        'Buyer already owns a licence for this song!',
      );
    });

    it('should handle successful song purchase', async () => {
      const dto: BuySongDto = {
        songId: song_1.id,
        buyerId: user_artist_1.id,
        txHash: 'txHash',
      };
      const result = await songService.buySong(dto);
      expect(result).toBeInstanceOf(ServiceResult);
      expect(result.data).toEqual(expect.any(LicenceDto));
    });
  });
});
