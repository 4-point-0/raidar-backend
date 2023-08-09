import { AlgoliaClient } from '../helpers/algolia/algolia.client';
import { Song } from '../modules/song/song.entity';
import { createConnection } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from '../modules/user/user.entity';
import { Listing } from '../modules/listing/listing.entity';
import { Album } from '../modules/album/album.entity';
import { File } from '../modules/file/file.entity';
import { existsSync } from 'fs';

dotenv.config({
  path: existsSync(`.env.${process.env.MODE}`)
    ? `.env.${process.env.MODE}`
    : '.env',
});

const run = async () => {
  const connection = await createConnection({
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DB,
    entities: [Song, User, Listing, Album, File],
  });

  const songRepository = connection.getRepository(Song);
  const songs = await songRepository.find();
  const indexName = `${process.env.ALGOLIA_INDEX_NAME}`;
  const algoliaClient = new AlgoliaClient(
    process.env.ALGOLIA_APPLICATION_ID,
    process.env.ALGOLIA_API_KEY,
    indexName,
  );

  const records = songs.map((song) => ({
    objectID: song.id,
    title: song.title,
    artist: song.pka,
    length: song.length,
    genre: song.genre,
    mood: song.mood,
    tags: song.tags,
    bpm: song.bpm,
    instrumental: song.instrumental,
    musical_key: song.musical_key,
  }));

  const indexingResult = await algoliaClient.indexMultipleRecords(records);
  console.log('Indexing result:', indexingResult);

  if (indexingResult instanceof Error) {
    console.error('Error indexing records to Algolia:', indexingResult);
  } else {
    console.log(`Indexed ${records.length} songs to Algolia.`);
  }

  await connection.close();
};

run();
