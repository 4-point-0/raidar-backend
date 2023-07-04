import { Controller, Get, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CommonApiResponse } from '../../helpers/decorators/api-response-swagger.decorator';
import { UserProfileDto } from './dto/user-profile.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @Get('me')
  @CommonApiResponse(UserProfileDto)
  findMe(@Req() request) {
    console.log(request.user);
    return UserProfileDto.fromEntityUser(request.user);
  }
}
