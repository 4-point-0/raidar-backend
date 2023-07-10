import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  Req,
  UseFilters,
} from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { SongService } from './song.service';
import { Auth } from '../../helpers/decorators/auth.decorator';
import { Role } from '../../common/enums/enum';
import { HttpExceptionFilter } from '../../helpers/filters/http-exception.filter';
import { CommonApiResponse } from '../../helpers/decorators/api-response-swagger.decorator';
import { AuthRequest } from '../../common/types/auth-request.type';
import { handle } from '../../helpers/response/handle';
import { CreateSongDto } from './dto/create-song.dto';
import { SongDto } from './dto/song.dto';
import { ApiPaginatedResponse } from '../../common/pagination/api-paginated-response';
import { ArtistSongsFilterDto } from './dto/artist-songs.filter.dto';
import { PaginatedDto } from '../../common/pagination/paginated-dto';

@ApiTags('song')
@Controller('song')
@ApiExtraModels(PaginatedDto)
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

  @Get(':id')
  @Auth(Role.Artist, Role.User)
  @UseFilters(new HttpExceptionFilter())
  @CommonApiResponse(SongDto)
  async findOne(@Req() request: AuthRequest, @Param('id') id: string) {
    return handle(await this.songService.findOne(id, request.user.roles));
  }

  @Get('artist/songs')
  @Auth(Role.Artist)
  @UseFilters(new HttpExceptionFilter())
  @ApiPaginatedResponse(SongDto)
  async findAllArtistSongs(
    @Req() request: AuthRequest,
    @Query() query: ArtistSongsFilterDto,
  ) {
    return handle(
      await this.songService.findAllArtistSongs(
        request.user.id,
        request.user.roles,
        query,
      ),
    );
  }

  @Get('user/songs')
  @Auth(Role.User)
  @UseFilters(new HttpExceptionFilter())
  @ApiPaginatedResponse(SongDto)
  async findAllUserSongs(
    @Req() request: AuthRequest,
    @Query() query: ArtistSongsFilterDto,
  ) {
    return handle(
      await this.songService.findAllUserSongs(
        request.user.id,
        request.user.roles,
        query,
      ),
    );
  }
}
