import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google, Auth } from 'googleapis';
import { NotFound, ServerError } from '../../helpers/response/errors';
import { ServiceResult } from '../../helpers/response/result';

@Injectable()
export class GoogleOAuthService {
  private readonly logger = new Logger(GoogleOAuthService.name);
  oAuthClient: Auth.OAuth2Client;
  constructor(private readonly configService: ConfigService) {
    const clientID = this.configService.get('google.client_id');
    const clientSecret = this.configService.get('google.secret');
    this.oAuthClient = new google.auth.OAuth2(clientID, clientSecret);
  }

  async getTokenInfo(token: string): Promise<ServiceResult<Auth.TokenInfo>> {
    try {
      const result = await this.oAuthClient.getTokenInfo(token);

      if (!result) {
        return new NotFound<Auth.TokenInfo>(`Can't get google auth token info`);
      }

      return new ServiceResult<Auth.TokenInfo>(result);
    } catch (error) {
      this.logger.error('AuthService - googleAuth', error);
      return new ServerError<Auth.TokenInfo>(
        `Can't get google auth token info`,
      );
    }
  }

  async getUserData(token: string) {
    const userInfoClient = google.oauth2('v2').userinfo;

    this.oAuthClient.setCredentials({
      access_token: token,
    });

    const userInfoResponse = await userInfoClient.get({
      auth: this.oAuthClient,
    });

    return userInfoResponse.data;
  }
}
