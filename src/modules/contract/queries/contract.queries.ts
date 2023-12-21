import { IsNull, Repository } from 'typeorm';
import { Contract } from '../contract.entity';

export const findBaseContractsByArtist = async (
  contractRepository: Repository<Contract>,
  artistId: string,
  take = 10,
  skip = 0,
): Promise<{ result: Contract[]; total: number }> => {
  const qb = contractRepository
    .createQueryBuilder('contract')
    .leftJoinAndSelect('contract.artist', 'artist')
    .leftJoinAndSelect('contract.customer', 'customer')
    .leftJoinAndSelect('contract.song', 'song')
    .where('contract.artist.id = :artistId AND contract.customer IS NULL', {
      artistId,
    })
    .take(take)
    .skip(skip);

  const [result, total] = await qb.getManyAndCount();

  return { result, total };
};

export const findSignedContractsByArtist = async (
  contractRepository: Repository<Contract>,
  artistId: string,
  take = 10,
  skip = 0,
): Promise<{ result: Contract[]; total: number }> => {
  const qb = contractRepository
    .createQueryBuilder('contract')
    .leftJoinAndSelect('contract.artist', 'artist')
    .leftJoinAndSelect('contract.customer', 'customer')
    .leftJoinAndSelect('contract.song', 'song')
    .where('contract.artist.id = :artistId AND contract.customer IS NOT NULL', {
      artistId,
    })
    .take(take)
    .skip(skip);

  const [result, total] = await qb.getManyAndCount();

  return { result, total };
};

export const findAllContractsByUser = async (
  contractRepository: Repository<Contract>,
  userId: string,
  take = 10,
  skip = 0,
): Promise<{ result: Contract[]; total: number }> => {
  const qb = contractRepository
    .createQueryBuilder('contract')
    .leftJoinAndSelect('contract.artist', 'artist')
    .leftJoinAndSelect('contract.customer', 'customer')
    .leftJoinAndSelect('contract.song', 'song')
    .where('contract.customer.id = :userId', { userId })
    .take(take)
    .skip(skip);

  const [result, total] = await qb.getManyAndCount();

  return { result, total };
};

export const findBaseContractsForSongID = (songId: string) => {
  return {
    where: { song: { id: songId }, customer: IsNull() },
    relations: ['artist', 'customer', 'song'],
  };
};
