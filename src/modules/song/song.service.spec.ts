import { Test, TestingModule } from '@nestjs/testing';
import { SongService } from './song.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Song } from './song.entity';
import { File } from '../file/file.entity';
import { User } from '../user/user.entity';
import { Album } from '../album/album.entity';
import { Listing } from '../listing/listing.entity';
import { Repository } from 'typeorm';
import { album_1, song_1 } from '../../../test/mock-data';
import { BadRequest, NotFound } from '../../helpers/response/errors';
import { SongDto } from './dto/song.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('SongService', () => {
  let songService: SongService;
  let songRepository: Repository<Song>;
  let fileRepository: Repository<File>;
  let userRepository: Repository<User>;
  let albumRepository: Repository<Album>;
  let listingRepository: Repository<Listing>;

  const SONG_REPOSITORY_TOKEN = getRepositoryToken(Song);
  const FILE_REPOSITORY_TOKEN = getRepositoryToken(File);
  const USER_REPOSITORY_TOKEN = getRepositoryToken(User);
  const ALBUM_REPOSITORY_TOKEN = getRepositoryToken(Album);
  const LISTING_REPOSITORY_TOKEN = getRepositoryToken(Listing);

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
    price: song_1.listings[0].price,
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
          provide: LISTING_REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn().mockResolvedValue(song_1.listings[0]),
            save: jest.fn().mockResolvedValue(song_1.listings[0]),
            findOneBy: jest.fn().mockResolvedValue(song_1.listings[0]),
          },
        },
      ],
    }).compile();

    songService = module.get<SongService>(SongService);
    songRepository = module.get<Repository<Song>>(SONG_REPOSITORY_TOKEN);
    fileRepository = module.get<Repository<File>>(FILE_REPOSITORY_TOKEN);
    userRepository = module.get<Repository<User>>(USER_REPOSITORY_TOKEN);
    albumRepository = module.get<Repository<Album>>(ALBUM_REPOSITORY_TOKEN);
    listingRepository = module.get<Repository<Listing>>(
      LISTING_REPOSITORY_TOKEN,
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
    expect(listingRepository).toBeDefined();
  });

  describe('create', () => {
    it('should create a song', async () => {
      const song = await songService.createSong(create_song_dto);
      jest
        .spyOn(fileRepository, 'findOneBy')
        .mockImplementationOnce(async () => song_1.music)
        .mockImplementationOnce(async () => song_1.art);
      expect(song.data.id).toStrictEqual(song_1.id);
    });

    it('create - should return (Bad request - 400) Title is required', async () => {
      const dto = { ...create_song_dto, title: null };
      const response = await songService.createSong(dto);
      expect(response).toStrictEqual(
        new BadRequest<SongDto>(`Title is required`),
      );
    });

    it('create - should return (Bad request - 400) Album is required', async () => {
      const dto = { ...create_song_dto, title: song_1.title, album_id: null };
      const response = await songService.createSong(dto);
      expect(response).toStrictEqual(
        new BadRequest<SongDto>(`Album is required`),
      );
    });

    it('create - should return (Not Found - 404) Album is required', async () => {
      const dto = { ...create_song_dto, title: song_1.title, album_id: '123' };
      jest
        .spyOn(albumRepository, 'findOneBy')
        .mockImplementationOnce(() => null);
      const response = await songService.createSong(dto);
      expect(response).toStrictEqual(new NotFound<SongDto>(`Album not found!`));
    });

    it('create - should return (Bad request - 400) Music id is required', async () => {
      const dto = { ...create_song_dto, music_id: null };
      const response = await songService.createSong(dto);
      expect(response).toStrictEqual(
        new BadRequest<SongDto>(`Music id is required`),
      );
    });

    it('create - should return (Not Found - 404) Music file not found!', async () => {
      const dto = { ...create_song_dto, music_id: '123' };
      jest
        .spyOn(fileRepository, 'findOneBy')
        .mockImplementationOnce(() => null)
        .mockImplementationOnce(async () => song_1.art);
      const response = await songService.createSong(dto);
      expect(response).toStrictEqual(
        new NotFound<SongDto>(`Music file not found!`),
      );
    });

    it('create - should return (Not Found - 404) Art file not found!', async () => {
      const dto = { ...create_song_dto, music_id: '123' };
      jest
        .spyOn(fileRepository, 'findOneBy')
        .mockImplementationOnce(async () => song_1.music)
        .mockImplementationOnce(() => null);
      const response = await songService.createSong(dto);
      expect(response).toStrictEqual(
        new NotFound<SongDto>(`Art file not found!`),
      );
    });

    it('create - should return (Not Found - 404) User not found!', async () => {
      const dto = { ...create_song_dto };
      jest
        .spyOn(userRepository, 'findOneBy')
        .mockImplementationOnce(async () => null);
      const response = await songService.createSong(dto);
      expect(response).toStrictEqual(new NotFound<SongDto>(`User not found!`));
    });
  });
});
