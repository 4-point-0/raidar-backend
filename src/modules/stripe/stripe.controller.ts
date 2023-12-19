import {
  BadRequestException,
  Controller,
  Post,
  Req,
  UseFilters,
  HttpCode,
  Param,
  RawBodyRequest,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StripeService } from './stripe.service';
import { HttpExceptionFilter } from '../../helpers/filters/http-exception.filter';
import { AuthRequest } from '../../common/types/auth-request.type';
import { Auth } from '../../helpers/decorators/auth.decorator';
import { Role } from '../../common/enums/enum';
import { handle } from '../../helpers/response/handle';

@ApiTags('stripe')
@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('session/:songId')
  @Auth(Role.User)
  @UseFilters(new HttpExceptionFilter())
  @HttpCode(200)
  async createSession(
    @Req() request: AuthRequest,
    @Param('songId') songId: string,
  ) {
    return handle(
      await this.stripeService.createCheckoutSession(songId, request.user.id),
    );
  }

  @Post('webhook')
  @UseFilters(new HttpExceptionFilter())
  async chargeCaptured(@Req() request: RawBodyRequest<Request>) {
    if (!request.headers['stripe-signature']) {
      throw new BadRequestException('Missing stripe-signature header');
    }
    return handle(
      await this.stripeService.constructEventFromPayload(
        request.headers['stripe-signature'],
        request.rawBody,
      ),
    );
  }
}
