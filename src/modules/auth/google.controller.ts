import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiExcludeEndpoint } from '@nestjs/swagger';
import { GoogleOauthGuard } from '../../helpers/guards/google-auth.guard';
import GoogleVerificationDto from './dto/google-verification.dto';
import { handle } from '../../helpers/response/handle';
import { AuthService } from './auth.service';

@ApiTags('google')
@Controller('google')
export class GoogleController {
  constructor(private readonly authService: AuthService) {}

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
  async authenticate(@Body() dto: GoogleVerificationDto) {
    return handle(await this.authService.googleAuth(dto.token));
  }
}
