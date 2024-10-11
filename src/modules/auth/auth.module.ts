import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { GoogleController } from './google.controller';
import { User } from '../user/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { GoogleStrategy } from '../../helpers/strategies/google.strategy';
import { JwtStrategy } from '../../helpers/strategies/jwt.strategy';
import { GoogleOAuthService } from './google-auth.service';
import { NearProviderService } from '../near-provider/near-provider.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('jwt.secret'),
        signOptions: { expiresIn: configService.get('jwt.expires_in') },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    GoogleStrategy,
    GoogleOAuthService,
    NearProviderService,
  ],
  controllers: [GoogleController],
})
export class AuthModule {}
