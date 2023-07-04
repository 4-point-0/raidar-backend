import { Body, Controller, HttpCode, Post, UseFilters } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { HttpExceptionFilter } from '../../helpers/filters/http-exception.filter';
import { CommonApiResponse } from '../../helpers/decorators/api-response-swagger.decorator';
import { AddWalletDto } from './dto/add-wallet.dto';
import { handle } from '../../helpers/response/handle';
import { Auth } from '../../helpers/decorators/auth.decorator';
import { Role } from '../../common/enums/enum';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('add-wallet')
  @Auth(Role.User, Role.Artist)
  @UseFilters(new HttpExceptionFilter())
  @CommonApiResponse(Boolean)
  @HttpCode(200)
  async addWallet(@Body() dto: AddWalletDto) {
    return handle(await this.userService.addWallet(dto));
  }
}
