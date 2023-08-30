import { Song } from '../song.entity';

export const mapSongToAlgoliaRecord = (song: Song): any => {
  return {
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
  };
};
