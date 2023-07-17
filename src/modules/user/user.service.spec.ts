import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from './user.entity';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AddWalletDto } from './dto/add-wallet.dto';
import { Repository } from 'typeorm';
import { isNearWallet } from '../../utils/near-wallet-validation';

jest.mock('../../utils/near-wallet-validation');

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;
  let httpService: HttpService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: HttpService,
          useValue: {
            post: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('addWallet', () => {
    it('should return BadRequest when the wallet_address is invalid', async () => {
      const addWalletDto: AddWalletDto = {
        id: '1',
        wallet_address: 'invalid_wallet_address',
      };

      (isNearWallet as jest.Mock).mockReturnValue(false);

      const result = await userService.addWallet(addWalletDto);

      expect(result.error.code).toEqual(400);
      expect(result.error.message).toEqual(
        `Wallet ${addWalletDto.wallet_address} not valid`,
      );
    });
  });

  //NEARVALIDATE is private and we usually avoid testing private methods ?
});
