import { SongFiltersDto } from '../dto/songs.filter.dto';

export const buildAlgoliaQueryForSongs = (
  filters: SongFiltersDto,
): {
  filters: string;
  hitsPerPage: number;
  page: number;
  facetFilters?: string[][];
} => {
  const take = filters.take || 10;
  const skip = filters.skip || 0;

  const filtersArray = [];
  const facetFiltersArray = [];

  if (filters.minLength) {
    filtersArray.push(`length >= ${filters.minLength}`);
  }

  if (filters.maxLength) {
    filtersArray.push(`length <= ${filters.maxLength}`);
  }

  if (filters.genre) {
    filtersArray.push(`genre:${filters.genre}`);
  }

  if (filters.minBpm) {
    filtersArray.push(`bpm >= ${filters.minBpm}`);
  }

  if (filters.maxBpm) {
    filtersArray.push(`bpm <= ${filters.maxBpm}`);
  }

  if (filters.instrumental !== undefined) {
    filtersArray.push(`instrumental:${filters.instrumental}`);
  }

  if (filters.musical_key) {
    filtersArray.push(`musical_key:${filters.musical_key}`);
  }

  if (filters.mood) {
    if (Array.isArray(filters.mood)) {
      filters.mood.forEach((mood) => {
        facetFiltersArray.push(['mood:' + mood]);
      });
    } else {
      facetFiltersArray.push(['mood:' + filters.mood]);
    }
  }

  if (filters.tags) {
    if (Array.isArray(filters.tags)) {
      filters.tags.forEach((tag) => {
        facetFiltersArray.push(['tags:' + tag]);
      });
    } else {
      facetFiltersArray.push(['tags:' + filters.tags]);
    }
  }

  const filtersString = filtersArray.join(' AND ');

  return {
    filters: filtersString,
    hitsPerPage: take,
    page: skip / take,
    facetFilters: facetFiltersArray.length > 0 ? facetFiltersArray : undefined,
  };
};
