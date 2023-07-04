import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get('google.client_id'),
      clientSecret: configService.get('google.secret'),
      callbackURL: configService.get('google.callback_url'),
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string): Promise<any> {
    const user = {
      token: accessToken,
    };
    return user;
  }
}
