import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contract } from './contract.entity';
import { AwsStorageService } from '../file/aws-storage.service';
import { ContractDto } from './dto/contract.dto';
import { CreateContractDto } from './dto/create-contract.dto';
import { User } from '../user/user.entity';
import { Song } from '../song/song.entity';
import {
  createContractMapper,
  mapPaginatedContractsDto,
} from './mappers/contract.mapper';
import {
  findBaseContractsByArtist,
  findSignedContractsByArtist,
  findAllContractsByUser,
} from './queries/contract.queries';
import { ServerError, NotFound } from '../../helpers/response/errors';
import { PaginatedDto } from '../../common/pagination/paginated-dto';
import { Role } from '../../common/enums/enum';
import { ServiceResult } from '../../helpers/response/result';

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
  ): Promise<ServiceResult<ContractDto>> {
    try {
      const uploadResult = await this.awsStorageService.uploadFile(
        file.buffer,
        file.mimetype,
      );
      if (uploadResult instanceof ServerError) {
        this.logger.error(
          'Failed to upload file to AWS S3',
          uploadResult.error,
        );
        return new ServerError<ContractDto>(uploadResult.error.message);
      }

      const song = await this.songRepository.findOne({
        where: { id: createContractDto.songId },
        relations: ['user'],
      });

      if (!song) {
        return new NotFound<ContractDto>('Song not found');
      }

      if (!song.user) {
        return new NotFound<ContractDto>(
          'Song does not have an associated artist',
        );
      }

      const contractData = createContractMapper(
        song.user,
        song,
        uploadResult.Location,
      );
      const contract = this.contractRepository.create(contractData);

      if (user.roles.includes(Role.User)) {
        contract.customer = user;
      }

      await this.contractRepository.save(contract);

      return new ServiceResult<ContractDto>(ContractDto.fromEntity(contract));
    } catch (error) {
      this.logger.error('ContractService - createContract', error);
      return new ServerError<ContractDto>('Unexpected error occurred');
    }
  }

  async findContractById(id: string): Promise<ServiceResult<ContractDto>> {
    try {
      const contract = await this.contractRepository.findOne({ where: { id } });
      if (!contract) {
        return new NotFound<ContractDto>('Contract not found');
      }
      return new ServiceResult<ContractDto>(ContractDto.fromEntity(contract));
    } catch (error) {
      this.logger.error('ContractService - findContractById', error);
      return new ServerError<ContractDto>('Unexpected error occurred');
    }
  }

  async findAllBaseContractsByArtist(
    artistId: string,
    options: any,
  ): Promise<ServiceResult<PaginatedDto<ContractDto>>> {
    try {
      const { take, skip } = options;
      const [contracts, total] = await this.contractRepository.findAndCount(
        findBaseContractsByArtist(artistId, take, skip),
      );
      return new ServiceResult<PaginatedDto<ContractDto>>(
        mapPaginatedContractsDto(contracts, total, take, skip),
      );
    } catch (error) {
      this.logger.error(
        'ContractService - findAllBaseContractsByArtist',
        error,
      );
      return new ServerError<PaginatedDto<ContractDto>>(
        'Unexpected error occurred',
      );
    }
  }

  async findAllSignedContractsByArtist(
    artistId: string,
    options: any,
  ): Promise<ServiceResult<PaginatedDto<ContractDto>>> {
    try {
      const { take, skip } = options;
      const [contracts, total] = await this.contractRepository.findAndCount(
        findSignedContractsByArtist(artistId, take, skip),
      );
      return new ServiceResult<PaginatedDto<ContractDto>>(
        mapPaginatedContractsDto(contracts, total, take, skip),
      );
    } catch (error) {
      this.logger.error(
        'ContractService - findAllSignedContractsByArtist',
        error,
      );
      return new ServerError<PaginatedDto<ContractDto>>(
        'Unexpected error occurred',
      );
    }
  }

  async findAllContractsByUser(
    userId: string,
    options: any,
  ): Promise<ServiceResult<PaginatedDto<ContractDto>>> {
    try {
      const { take, skip } = options;
      const [contracts, total] = await this.contractRepository.findAndCount(
        findAllContractsByUser(userId, take, skip),
      );
      return new ServiceResult<PaginatedDto<ContractDto>>(
        mapPaginatedContractsDto(contracts, total, take, skip),
      );
    } catch (error) {
      this.logger.error('ContractService - findAllContractsByUser', error);
      return new ServerError<PaginatedDto<ContractDto>>(
        'Unexpected error occurred',
      );
    }
  }
}
