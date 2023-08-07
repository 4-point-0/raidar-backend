import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  BadRequest,
  Forbidden,
  NotFound,
  ServerError,
} from '../../helpers/response/errors';
import { ServiceResult } from '../../helpers/response/result';
import { GoogleOAuthService } from './google-auth.service';
import { JwtTokenDto } from './dto/jwt-token.dto';
import { GoogleUserDto } from './dto/google-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';
import { Provider, Role } from '../../common/enums/enum';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private readonly googleAuthService: GoogleOAuthService,
  ) {}

  generateJwt(payload) {
    return this.jwtService.sign(payload);
  }

  async googleAuth(token: string): Promise<ServiceResult<JwtTokenDto>> {
    try {
      if (!token) {
        return new Forbidden<JwtTokenDto>(`Not valid token!`);
      }

      const tokenInfo = await this.googleAuthService.getTokenInfo(token);

      if (!tokenInfo) {
        return new Forbidden<JwtTokenDto>(`Not valid token!`);
      }

      if (tokenInfo instanceof NotFound) {
        return new NotFound<JwtTokenDto>(tokenInfo.error.message);
      }

      if (tokenInfo instanceof ServerError) {
        return new ServerError<JwtTokenDto>(tokenInfo.error.message);
      }

      if (tokenInfo && !tokenInfo.data) {
        return new BadRequest<JwtTokenDto>(`Not valid token!`);
      }

      const tokenInfoData = tokenInfo.data;

      const user = await this.userRepository.findOne({
        where: { email: tokenInfoData.email },
      });

      if (!user) {
        const user_info = await this.googleAuthService.getUserData(token);
        return this.registerGoolgeUser({
          email: tokenInfoData.email,
          provider: Provider.Google,
          provider_id: tokenInfoData.sub,
          first_name: user_info.given_name,
          last_name: user_info.family_name,
        });
      }

      const response = {
        token: this.generateJwt({
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          provider: user.provider,
          provider_id: user.provider_id,
          roles: user.roles,
        }),
      };

      return new ServiceResult<JwtTokenDto>(response);
    } catch (error) {
      this.logger.error('AuthService - googleAuth', error);
      return new ServerError<JwtTokenDto>(`Can't get jwt token`);
    }
  }

  async registerGoolgeUser(
    user: GoogleUserDto,
  ): Promise<ServiceResult<JwtTokenDto>> {
    try {
      const newUser = this.userRepository.create({
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        provider: user.provider,
        provider_id: user.provider_id,
        roles: [Role.Artist],
      });
      await this.userRepository.save(newUser);

      const dto = {
        token: this.generateJwt({
          email: newUser.email,
          first_name: newUser.first_name,
          last_name: newUser.last_name,
          provider: newUser.provider,
          provider_id: newUser.provider_id,
          roles: newUser.roles,
        }),
      };
      return new ServiceResult<JwtTokenDto>(dto);
    } catch (error) {
      this.logger.error('AuthService - registerGoolgeUser', error);
      return new ServerError<JwtTokenDto>(`Can't get jwt token`);
    }
  }
}
