import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseFilters,
} from '@nestjs/common';
import { HttpExceptionFilter } from '../../helpers/filters/http-exception.filter';
import { AddWalletDto } from './dto/add-wallet.dto';
import { handle } from '../../helpers/response/handle';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CommonApiResponse } from '../../helpers/decorators/api-response-swagger.decorator';
import { UserProfileDto } from './dto/user-profile.dto';
import { Role } from '../../common/enums/enum';
import { Auth } from '../../helpers/decorators/auth.decorator';

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

  @Auth(Role.User, Role.Artist)
  @Get('me')
  @CommonApiResponse(UserProfileDto)
  findMe(@Req() request) {
    return UserProfileDto.fromEntityUser(request.user);
  }
}
