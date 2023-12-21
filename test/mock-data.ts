import { Role } from '../src/common/enums/enum';
import { User } from '../src/modules/user/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { Provider } from '../src/common/enums/enum';
import { Album } from '../src/modules/album/album.entity';
import { File } from '../src/modules/file/file.entity';
import { addDays } from '../src/common/date/date-helper';
import { Song } from '../src/modules/song/song.entity';
import { Licence } from '../src/modules/licence/licence.entity';
import { Contract } from '../src/modules/contract/contract.entity';

export const user_artist_1: Partial<User> = {
  id: uuidv4(),
  first_name: 'Bob',
  last_name: 'Smith',
  email: 'bob@email.com',
  roles: [Role.Artist, Role.User],
  provider: Provider.Google,
  provider_id: '123',
  created_at: new Date(),
  updated_at: new Date(),
};

export const album_file_1: Partial<File> = {
  id: uuidv4(),
  name: 'album_file_1',
  key: 'album_1_key',
  url: 'www.google.com',
  mime_type: 'image/jpeg',
  url_expiry: addDays(new Date(), 30),
  created_at: new Date(),
  updated_at: new Date(),
  created_by_id: user_artist_1.id,
  updated_by_id: user_artist_1.id,
};

export const album_1: Partial<Album> = {
  id: uuidv4(),
  title: 'album_1',
  pka: 'jayz',
  cover: album_file_1 as File,
  created_at: new Date(),
  updated_at: new Date(),
  created_by_id: user_artist_1.id,
  updated_by_id: user_artist_1.id,
};

export const song_music_1: Partial<File> = {
  id: uuidv4(),
  name: 'song_music_1',
  key: 'song_1_key',
  url: 'www.google.com',
  mime_type: 'audio/wav',
  url_expiry: addDays(new Date(), 30),
  created_at: new Date(),
  updated_at: new Date(),
  created_by_id: user_artist_1.id,
  updated_by_id: user_artist_1.id,
};

export const song_art_1: Partial<File> = {
  id: uuidv4(),
  name: 'song_art_1',
  key: 'song_1_art',
  url: 'www.google.com',
  mime_type: 'image/jpeg',
  url_expiry: addDays(new Date(), 30),
  created_at: new Date(),
  updated_at: new Date(),
  created_by_id: user_artist_1.id,
  updated_by_id: user_artist_1.id,
};

export const song_licence_1: Partial<Licence> = {
  id: uuidv4(),
  buyer: null,
  seller: user_artist_1 as User,
  sold_price: '154324234230000000000000',
  updated_at: new Date(),
  created_by_id: user_artist_1.id,
  updated_by_id: user_artist_1.id,
};

export const song_1: Partial<Song> = {
  id: uuidv4(),
  title: 'song_1',
  pka: 'jayz',
  music: song_music_1 as File,
  art: song_art_1 as File,
  album: album_1 as Album,
  bpm: 120,
  length: 120,
  genre: 'rap',
  instrumental: false,
  languages: ['en'],
  mood: ['happy'],
  musical_key: 'C',
  tags: ['rap', 'hiphop'],
  recording_country: 'US',
  recording_date: new Date(),
  recording_location: 'New York',
  vocal_ranges: ['tenor'],
  user: user_artist_1 as User,
  price: 14,
  licences: [song_licence_1 as Licence],
  created_at: new Date(),
  updated_at: new Date(),
  created_by_id: user_artist_1.id,
  updated_by_id: user_artist_1.id,
};

const user_2 = Object.assign(new User(), {
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

export const song_list: Song[] = [
  Object.assign(new Song(), {
    id: '1',
    title: 'Test song 1',
    user: user_2,
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
        seller: user_2,
        buyer: user_2,
        tx_hash: 'Test tx hash 1',
      }),
    ],
    price: 10.0,
  }),
];

export const contract_list: Contract[] = [
  Object.assign(new Contract(), {
    id: 'contract-id',
    artist: user_artist_1,
    customer: user_artist_1,
    song: song_list[0],
    pdfUrl: 'http://example.com/contract.pdf',
  }),
];
