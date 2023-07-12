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
import { ApiExtraModels, ApiQuery, ApiTags } from '@nestjs/swagger';
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
import { SongFiltersDto } from './dto/songs.filter.dto';
import { OptionalIntPipe } from '../../helpers/pipes/parse-int.pipe';

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
  @ApiQuery({ name: 'title', required: false, type: String })
  @ApiQuery({ name: 'artist', required: false, type: String })
  @ApiQuery({ name: 'minLength', required: false, type: Number })
  @ApiQuery({ name: 'maxLength', required: false, type: Number })
  @ApiQuery({ name: 'genre', required: false, type: String })
  @ApiQuery({ name: 'mood', required: false, type: String, isArray: true })
  @ApiQuery({ name: 'tags', required: false, type: String, isArray: true })
  @ApiQuery({ name: 'minBpm', required: false, type: Number })
  @ApiQuery({ name: 'maxBpm', required: false, type: Number })
  @ApiQuery({ name: 'instrumental', required: false, type: Boolean })
  @ApiQuery({ name: 'musical_key', required: false, type: String })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  async findAllArtistSongs(
    @Req() request: AuthRequest,
    @Query('minLength', new OptionalIntPipe()) minLength,
    @Query('maxLength', new OptionalIntPipe()) maxLength,
    @Query('minBpm', new OptionalIntPipe()) minBpm,
    @Query('maxBpm', new OptionalIntPipe()) maxBpm,
    @Query('take', new OptionalIntPipe()) take,
    @Query('skip', new OptionalIntPipe()) skip,
    @Query('title') title,
    @Query('artist') artist,
    @Query('genre') genre,
    @Query('mood') mood,
    @Query('tags') tags,
    @Query('instrumental') instrumental,
    @Query('musical_key') musical_key,
  ) {
    const filters: SongFiltersDto = {
      title,
      artist,
      minLength,
      maxLength,
      genre,
      mood,
      tags,
      minBpm,
      maxBpm,
      instrumental,
      musical_key,
      take,
      skip,
    };

    return handle(
      await this.songService.findAllArtistSongs(
        request.user.id,
        request.user.roles,
        filters,
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
