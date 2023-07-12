import { Controller, Get, Query, Req, UseFilters } from '@nestjs/common';
import { ApiExtraModels, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Auth } from '../../helpers/decorators/auth.decorator';
import { Role } from '../../common/enums/enum';
import { HttpExceptionFilter } from '../../helpers/filters/http-exception.filter';
import { AuthRequest } from '../../common/types/auth-request.type';
import { handle } from '../../helpers/response/handle';
import { SongDto } from '../song/dto/song.dto';
import { ApiPaginatedResponse } from '../../common/pagination/api-paginated-response';
import { PaginatedDto } from '../../common/pagination/paginated-dto';
import { SongFiltersDto } from './dto/songs.filter.dto';
import { OptionalIntPipe } from '../../helpers/pipes/parse-int.pipe';
import { MarketplaceService } from './marketplace.service';

@ApiTags('marketplace')
@Controller('marketplace')
@ApiExtraModels(PaginatedDto)
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Get('songs')
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
  async findAllMarketplaceArtistSongs(
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
      await this.marketplaceService.findAllMarketplaceArtistSongs(
        request.user.id,
        request.user.roles,
        filters,
      ),
    );
  }
}
