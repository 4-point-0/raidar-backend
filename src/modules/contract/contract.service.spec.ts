import { Test, TestingModule } from '@nestjs/testing';
import { ContractService } from './contract.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Contract } from './contract.entity';
import { AwsStorageService } from '../file/aws-storage.service';
import { Song } from '../song/song.entity';
import { User } from '../user/user.entity';
import { contract_list, song_1, user_artist_1 } from '../../../test/mock-data';
import { Role } from '../../common/enums/enum';
import { EmailService } from '../email/email.service';
import { ConfigService } from '@nestjs/config';
import * as ContractQueries from './queries/contract.queries';

describe('ContractService', () => {
  let service: ContractService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContractService,
        {
          provide: getRepositoryToken(Contract),
          useValue: {
            create: jest.fn().mockImplementation((contractData) => ({
              ...new Contract(),
              ...contractData,
              artist: user_artist_1 as User,
              song: song_1 as Song,
            })),
            save: jest.fn().mockImplementation(async (contract: Contract) => ({
              ...contract,
              artist: user_artist_1 as User,
              song: song_1 as Song,
            })),
            findOne: jest.fn().mockImplementation(async (id: string) => ({
              ...new Contract(),
              artist: user_artist_1 as User,
              song: song_1 as Song,
              id,
            })),
          },
        },
        {
          provide: getRepositoryToken(Song),
          useValue: {
            findOne: jest.fn().mockImplementation(async (id: string) => ({
              ...new Song(),
              id,
              user: user_artist_1 as User,
            })),
          },
        },
        {
          provide: EmailService,
          useValue: {
            send: jest.fn().mockReturnValue(true),
          },
        },
        {
          provide: AwsStorageService,
          useValue: {
            uploadFile: jest.fn().mockImplementation(async () => ({
              Location: 'url-of-uploaded-file',
            })),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'sengrid.email') {
                return '123';
              }

              if (key === 'sendgrid.api_key') {
                return '123';
              }
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<ContractService>(ContractService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createContract', () => {
    it('should create a contract', async () => {
      const localUserArtist = {
        ...user_artist_1,
        roles: [Role.Artist],
      };

      const createContractDto = { songId: 'song-id' };
      const file = Buffer.from('test');
      const result = await service.createContract(
        localUserArtist as User,
        createContractDto,
        file as any,
      );

      expect(result).toBeDefined();
    });
  });

  describe('findBaseContractBySongId', () => {
    it('should find a contract by songid', async () => {
      const result = await service.findBaseContractBySongId('song-id');
      expect(result).toBeDefined();
    });
  });

  describe('findAllBaseContractsByArtist', () => {
    it('should find all base contracts by an artist', async () => {
      const mockQueryResult = {
        result: contract_list,
        total: contract_list.length,
      };

      jest
        .spyOn(ContractQueries, 'findBaseContractsByArtist')
        .mockResolvedValue(mockQueryResult);
      const result = await service.findAllBaseContractsByArtist(
        user_artist_1.id,
        { page: 1, limit: 10 },
      );
      expect(result).toBeDefined();
    });
  });

  describe('findAllSignedContractsByArtist', () => {
    it('should find all signed contracts by an artist', async () => {
      const mockQueryResult = {
        result: contract_list,
        total: contract_list.length,
      };

      jest
        .spyOn(ContractQueries, 'findSignedContractsByArtist')
        .mockResolvedValue(mockQueryResult);
      const result = await service.findAllSignedContractsByArtist(
        user_artist_1.id,
        { page: 1, limit: 10 },
      );
      expect(result).toBeDefined();
    });
  });

  describe('findAllContractsByUser', () => {
    it('should find all contracts by a user', async () => {
      const mockQueryResult = {
        result: contract_list,
        total: contract_list.length,
      };

      jest
        .spyOn(ContractQueries, 'findAllContractsByUser')
        .mockResolvedValue(mockQueryResult);

      const result = await service.findAllContractsByUser(user_artist_1.id, {
        page: 1,
        limit: 10,
      });
      expect(result).toBeDefined();
    });
  });
});
