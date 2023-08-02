import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';
import { GoogleOAuthService } from './google-auth.service';
import { Provider, Role } from '../../common/enums/enum';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let userRepository: Repository<User>;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    first_name: 'firstName',
    last_name: 'lastName',
    roles: [Role.Artist],
    provider: Provider.Google,
    provider_id: 'providerId',
    wallet_address: null,
    songs: [],
    listings_sold: [],
    listings_purchased: [],
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn().mockResolvedValue(null),
            save: jest.fn(),
            create: jest.fn().mockReturnValue(mockUser),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('jwt_token'),
          },
        },
        {
          provide: GoogleOAuthService,
          useValue: {
            getTokenInfo: jest.fn().mockResolvedValue({
              data: {
                email: 'test@example.com',
                sub: 'providerId',
              },
            }),
            getUserData: jest.fn().mockResolvedValue({
              given_name: 'firstName',
              family_name: 'lastName',
            }),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a jwt token when a new google user is authenticated', async () => {
    const result = await service.googleAuth('token');

    expect(jwtService.sign).toHaveBeenCalled();
    expect(userRepository.findOne).toHaveBeenCalled();
    expect(result).toHaveProperty('data');
    expect(result.data.token).toBe('jwt_token');
  });

  it('should return a jwt token when an existing google user is authenticated', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

    const result = await service.googleAuth('token');

    expect(jwtService.sign).toHaveBeenCalled();
    expect(userRepository.findOne).toHaveBeenCalled();
    expect(result).toHaveProperty('data');
    expect(result.data.token).toBe('jwt_token');
  });
});
