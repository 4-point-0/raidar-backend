import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  Req,
  Res,
  StreamableFile,
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
import { BuySongDto } from './dto/buy-song.dto';
import { LicenceDto } from '../licence/dto/licence.dto';
import { HttpService } from '@nestjs/axios';

@ApiTags('song')
@Controller('song')
@ApiExtraModels(PaginatedDto)
export class SongController {
  constructor(
    private readonly songService: SongService,
    private readonly httpService: HttpService,
  ) {}

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

  @Post('buy')
  @UseFilters(new HttpExceptionFilter())
  @Auth(Role.User)
  @CommonApiResponse(LicenceDto)
  async buySong(@Body() dto: BuySongDto) {
    return handle(await this.songService.buySong(dto));
  }

  @Get(':tokenId/media')
  @UseFilters(new HttpExceptionFilter())
  @CommonApiResponse(StreamableFile)
  @HttpCode(200)
  async getNftMedia(@Res() res: Response, @Param('tokenId') tokenId: string) {
    const result = await handle(await this.songService.getSongMedia(tokenId));
    const response = await this.httpService.axiosRef(result, {
      responseType: 'stream',
    });
    response.data.pipe(res);
  }
}
