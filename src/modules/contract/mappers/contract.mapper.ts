import { Contract } from '../contract.entity';
import { ContractDto } from '../dto/contract.dto';
import { User } from '../../../modules/user/user.entity';
import { Song } from '../../../modules/song/song.entity';
import { PaginatedDto } from '../../../common/pagination/paginated-dto';

export const createContractMapper = (
  dto: ContractDto,
  artist: User,
  song: Song,
  pdfUrl: string,
): Partial<Contract> => {
  return {
    artist: artist,
    song: song,
    pdfUrl: pdfUrl,
    created_at: new Date(),
    updated_at: new Date(),
    created_by_id: artist.id,
    updated_by_id: artist.id,
  };
};

export const mapPaginatedContractsDto = (
  contracts: Contract[],
  total: number,
  take?: number,
  skip?: number,
): PaginatedDto<ContractDto> => {
  const contractDtos: ContractDto[] = contracts.map((contract) =>
    ContractDto.fromEntity(contract),
  );

  return {
    total: total,
    take: Number(take),
    skip: Number(skip),
    count: contractDtos.length,
    results: contractDtos,
  };
};

export const mapContractToDto = (contract: Contract): ContractDto => {
  return ContractDto.fromEntity(contract);
};
