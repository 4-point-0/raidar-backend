import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contract } from './contract.entity';
import { AwsStorageService } from '../file/aws-storage.service';
import { ContractDto } from './dto/contract.dto';
import { CreateContractDto } from './dto/create-contract.dto';
import { User } from '../user/user.entity';
import { Song } from '../song/song.entity';
import { mapPaginatedContractsDto } from './mappers/contract.mapper';
import {
  findBaseContractsByArtist,
  findSignedContractsByArtist,
  findAllContractsByUser,
} from './queries/contract.queries';
import { ServerError } from '../../helpers/response/errors';
import { PaginatedDto } from '../../common/pagination/paginated-dto';
import { Role } from '../../common/enums/enum';

@Injectable()
export class ContractService {
  private readonly logger = new Logger(ContractService.name);

  constructor(
    @InjectRepository(Contract)
    private contractRepository: Repository<Contract>,
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
    private awsStorageService: AwsStorageService,
  ) {}

  async createContract(
    user: User,
    createContractDto: CreateContractDto,
    file: Express.Multer.File,
  ): Promise<ContractDto> {
    const uploadResult = await this.awsStorageService.uploadFile(
      file.buffer,
      file.mimetype,
    );

    if (uploadResult instanceof ServerError) {
      this.logger.error('Failed to upload file to AWS S3', uploadResult.error);
      throw new Error(uploadResult.error.message);
    }

    const song = await this.songRepository.findOne({
      where: { id: createContractDto.songId },
      relations: ['user'],
    });

    if (!song) {
      throw new Error('Song not found');
    }

    if (!song.user) {
      throw new Error('Song does not have an associated artist');
    }

    const contract = new Contract();
    contract.song = song;
    contract.artist = song.user;
    contract.pdfUrl = uploadResult.Location;
    contract.created_at = new Date();
    contract.updated_at = new Date();
    contract.created_by_id = user.id;
    contract.updated_by_id = user.id;

    if (user.roles.includes(Role.User)) {
      contract.customer = user;
    }

    await this.contractRepository.save(contract);

    return ContractDto.fromEntity(contract);
  }

  async findContractById(id: string): Promise<ContractDto> {
    const contract = await this.contractRepository.findOne({ where: { id } });

    if (!contract) {
      throw new Error('Contract not found');
    }

    return ContractDto.fromEntity(contract);
  }

  async findAllBaseContractsByArtist(
    artistId: string,
    options: any,
  ): Promise<PaginatedDto<ContractDto>> {
    const { take, skip } = options;
    const [contracts, total] = await this.contractRepository.findAndCount(
      findBaseContractsByArtist(artistId, take, skip),
    );
    return mapPaginatedContractsDto(contracts, total, take, skip);
  }

  async findAllSignedContractsByArtist(
    artistId: string,
    options: any,
  ): Promise<PaginatedDto<ContractDto>> {
    const { take, skip } = options;
    const [contracts, total] = await this.contractRepository.findAndCount(
      findSignedContractsByArtist(artistId, take, skip),
    );
    return mapPaginatedContractsDto(contracts, total, take, skip);
  }

  async findAllContractsByUser(
    userId: string,
    options: any,
  ): Promise<PaginatedDto<ContractDto>> {
    const { take, skip } = options;
    const [contracts, total] = await this.contractRepository.findAndCount(
      findAllContractsByUser(userId, take, skip),
    );
    return mapPaginatedContractsDto(contracts, total, take, skip);
  }
}
