import { Controller, Get, Req } from '@nestjs/common';
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

  @Auth(Role.User, Role.Artist)
  @Get('me')
  @CommonApiResponse(UserProfileDto)
  findMe(@Req() request) {
    console.log(request.user);
    return UserProfileDto.fromEntityUser(request.user);
  }
}
