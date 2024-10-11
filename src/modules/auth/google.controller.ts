import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { GoogleOauthGuard } from '../../helpers/guards/google-auth.guard';
import GoogleLoginDto from './dto/google-login.dto';
import { handle } from '../../helpers/response/handle';
import { AuthService } from './auth.service';
import { NearProviderService } from '../near-provider/near-provider.service';

@ApiTags('google')
@Controller('google')
export class GoogleController {
  constructor(
    private readonly authService: AuthService,
    private readonly nearProviderService: NearProviderService,
  ) {}

  @Get('sign-in-backend')
  @UseGuards(GoogleOauthGuard)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async googleAuth() {}

  @Get('redirect')
  @ApiExcludeEndpoint()
  @UseGuards(GoogleOauthGuard)
  async googleAuthRedirect(@Req() req) {
    return handle(await this.authService.googleAuth(req.user.token));
  }

  @Post('auth')
  async authenticate(@Body() dto: GoogleLoginDto) {
    return handle(await this.authService.googleAuth(dto.token));
  }

  @Post('fund-wallet')
  @ApiOperation({ summary: 'Fund a NEAR wallet' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async fundWallet(@Body() body: { walletAddress: string }) {
    const result = await this.nearProviderService.fundWithNear(
      body.walletAddress,
    );
    return { success: result };
  }
}
