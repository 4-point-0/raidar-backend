import { Controller, Get, Query, Req, UseFilters } from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { Auth } from '../../helpers/decorators/auth.decorator';
import { Role } from '../../common/enums/enum';
import { HttpExceptionFilter } from '../../helpers/filters/http-exception.filter';
import { AuthRequest } from '../../common/types/auth-request.type';
import { handle } from '../../helpers/response/handle';
import { SongDto } from '../song/dto/song.dto';
import { ApiPaginatedResponse } from '../../common/pagination/api-paginated-response';
import { PaginatedDto } from '../../common/pagination/paginated-dto';
import { SongFiltersDto } from './dto/songs.filter.dto';
import { MarketplaceService } from './marketplace.service';

@ApiTags('marketplace')
@Controller('marketplace')
@ApiExtraModels(PaginatedDto)
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Get('songs')
  @Auth(Role.Artist, Role.User)
  @UseFilters(new HttpExceptionFilter())
  @ApiPaginatedResponse(SongDto)
  async findAll(@Req() request: AuthRequest, @Query() filters: SongFiltersDto) {
    return handle(
      await this.marketplaceService.findAll(request.user.roles, filters),
    );
  }
}
