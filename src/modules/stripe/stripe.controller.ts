import {
  BadRequestException,
  Controller,
  Post,
  Req,
  UseFilters,
  HttpCode,
  Body,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StripeService } from './stripe.service';
import { HttpExceptionFilter } from '../../helpers/filters/http-exception.filter';
import { CommonApiResponse } from '../../helpers/decorators/api-response-swagger.decorator';
import { CreateSessionDto } from './dto/create-session.dto';

@ApiTags('stripe')
@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('session')
  @UseFilters(new HttpExceptionFilter())
  @CommonApiResponse({ type: CreateSessionDto }) // Adjust response type if needed
  @HttpCode(200)
  async createSession(@Body() createSessionDto: CreateSessionDto) {
    return this.stripeService.createCheckoutSession(
      createSessionDto.songId,
      createSessionDto.userId,
      createSessionDto.priceId,
    );
  }

  @Post('webhook')
  @UseFilters(new HttpExceptionFilter())
  @HttpCode(200)
  async handleWebhook(@Req() request: any) {
    if (!request.headers['stripe-signature']) {
      throw new BadRequestException('Missing stripe-signature header');
    }
    return this.stripeService.constructEventFromPayload(
      request.headers['stripe-signature'],
      request.rawBody,
    );
  }
}
