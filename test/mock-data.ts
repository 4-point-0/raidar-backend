import { Role } from '../src/common/enums/enum';
import { User } from '../src/modules/user/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { Provider } from '../src/common/enums/enum';
import { Album } from '../src/modules/album/album.entity';
import { File } from '../src/modules/file/file.entity';
import { addDays } from '../src/common/date/date-helper';
import { Song } from '../src/modules/song/song.entity';
import { Listing } from '../src/modules/listing/listing.entity';

export const user_artist_1: Partial<User> = {
  id: uuidv4(),
  first_name: 'Bob',
  last_name: 'Smith',
  email: 'bob@email.com',
  roles: [Role.Artist],
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

export const song_listing_1: Partial<Listing> = {
  id: uuidv4(),
  buyer: null,
  seller: user_artist_1 as User,
  price: 50,
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
  listings: [song_listing_1 as Listing],
  created_at: new Date(),
  updated_at: new Date(),
  created_by_id: user_artist_1.id,
  updated_by_id: user_artist_1.id,
};
