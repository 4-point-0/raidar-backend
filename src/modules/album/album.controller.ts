import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  UseFilters,
  HttpCode,
  Req,
  Query,
} from '@nestjs/common';
import { HttpExceptionFilter } from '../../helpers/filters/http-exception.filter';
import { AlbumDto } from './dto/album.dto';
import { handle } from '../../helpers/response/handle';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { AlbumService } from './album.service';
import { CommonApiResponse } from '../../helpers/decorators/api-response-swagger.decorator';
import { CreateAlbumDto } from './dto/create-album.dto';
import { Auth } from '../../helpers/decorators/auth.decorator';
import { Role } from '../../common/enums/enum';
import { AlbumFilterDto } from './dto/album-filter.dto';
import { PaginatedDto } from '../../common/pagination/paginated-dto';
import { ApiPaginatedResponse } from '../../common/pagination/api-paginated-response';
import { AuthRequest } from '../../common/types/auth-request.type';

@ApiTags('album')
@Controller('album')
@ApiExtraModels(PaginatedDto)
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Post()
  @Auth(Role.Artist)
  @UseFilters(new HttpExceptionFilter())
  @CommonApiResponse(AlbumDto)
  @HttpCode(200)
  async createAlbum(@Body() dto: CreateAlbumDto, @Req() request) {
    return handle(
      await this.albumService.create(dto, request.user.id, request.user.roles),
    );
  }

  @Get(':id')
  @Auth(Role.Artist)
  @UseFilters(new HttpExceptionFilter())
  @CommonApiResponse(AlbumDto)
  async findOne(@Param('id') id: string) {
    return handle(await this.albumService.findOne(id));
  }

  @Get()
  @Auth(Role.Artist)
  @UseFilters(new HttpExceptionFilter())
  @ApiPaginatedResponse(AlbumDto)
  async findAll(@Req() request: AuthRequest, @Query() query: AlbumFilterDto) {
    return handle(await this.albumService.findAll(request.user.roles, query));
  }
}
