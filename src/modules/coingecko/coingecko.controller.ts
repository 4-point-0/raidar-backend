import { ApiTags } from '@nestjs/swagger';
import { CoingeckoService } from './coingecko.service';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseFilters,
} from '@nestjs/common';
import { HttpExceptionFilter } from '../../helpers/filters/http-exception.filter';
import { Auth } from '../../helpers/decorators/auth.decorator';
import { CommonApiResponse } from '../../helpers/decorators/api-response-swagger.decorator';
import { handle } from '../../helpers/response/handle';
import { PriceDto } from './dto/price.dto';
import { Role } from '../../common/enums/enum';

@ApiTags('coingecko')
@Controller('coingecko')
export class CoingeckoController {
  constructor(private readonly coingeckoService: CoingeckoService) {}

  @Get('near-price')
  @UseFilters(new HttpExceptionFilter())
  @Auth(Role.Admin)
  @CommonApiResponse(Number)
  async getNearPrice() {
    return handle(await this.coingeckoService.getCurrentNearPrice());
  }

  @Post('near-price')
  @UseFilters(new HttpExceptionFilter())
  @Auth(Role.Admin)
  @CommonApiResponse(Number)
  @HttpCode(200)
  async setNearPrice(@Body() dto: PriceDto) {
    return handle(await this.coingeckoService.setNearPrice(dto.price));
  }

  @Post('near-price-coingecko')
  @UseFilters(new HttpExceptionFilter())
  @Auth(Role.Admin)
  @CommonApiResponse(Number)
  @HttpCode(200)
  async setNearCoingeckoPrice() {
    return handle(await this.coingeckoService.setNearCoingeckoPrice());
  }

  @Get('storage-price')
  @UseFilters(new HttpExceptionFilter())
  @Auth(Role.Admin)
  @CommonApiResponse(Object)
  async getStoragePrice() {
    return handle(await this.coingeckoService.getStoragePrices());
  }
}
