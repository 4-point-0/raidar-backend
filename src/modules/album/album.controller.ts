import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  UseFilters,
  HttpCode,
  Req,
} from '@nestjs/common';
import { HttpExceptionFilter } from '../../helpers/filters/http-exception.filter';
import { AlbumDto } from './dto/album.dto';
import { handle } from '../../helpers/response/handle';
import { ApiTags } from '@nestjs/swagger';
import { AlbumService } from './album.service';
import { CommonApiResponse } from '../../helpers/decorators/api-response-swagger.decorator';
import { CreateAlbumDto } from './dto/create-album.dto';
import { Auth } from '../../helpers/decorators/auth.decorator';
import { Role } from '../../common/enums/enum';

@ApiTags('album')
@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Post('create')
  @Auth(Role.Artist)
  @UseFilters(new HttpExceptionFilter())
  @CommonApiResponse(AlbumDto)
  @HttpCode(200)
  async createAlbum(@Body() dto: CreateAlbumDto, @Req() request) {
    return handle(
      await this.albumService.create(
        dto,
        request.user.id,
        request.user.roles[0],
      ),
    );
  }

  @Get(':id')
  @UseFilters(new HttpExceptionFilter())
  @CommonApiResponse(AlbumDto)
  async getAlbum(@Param('id') id: string) {
    return handle(await this.albumService.getAlbum(id));
  }

  @Get()
  @UseFilters(new HttpExceptionFilter())
  @CommonApiResponse([AlbumDto])
  async getAllAlbums() {
    return handle(await this.albumService.getAll());
  }
}
