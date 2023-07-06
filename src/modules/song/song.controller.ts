import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseFilters,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SongService } from './song.service';
import { Auth } from '../../helpers/decorators/auth.decorator';
import { Role } from '../../common/enums/enum';
import { HttpExceptionFilter } from '../../helpers/filters/http-exception.filter';
import { CommonApiResponse } from '../../helpers/decorators/api-response-swagger.decorator';
import { AuthRequest } from '../../common/types/auth-request.type';
import { handle } from '../../helpers/response/handle';
import { CreateSongDto } from './dto/create-song.dto';
import { SongDto } from './dto/song.dto';

@ApiTags('song')
@Controller('song')
export class SongController {
  constructor(private readonly songService: SongService) {}

  @Post()
  @Auth(Role.Artist)
  @UseFilters(new HttpExceptionFilter())
  @CommonApiResponse(SongDto)
  @HttpCode(200)
  async createSong(@Req() request: AuthRequest, @Body() dto: CreateSongDto) {
    dto.user_id = request.user.id;
    dto.roles = request.user.roles;
    return handle(await this.songService.createSong(dto));
  }
}
