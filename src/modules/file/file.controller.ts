import {
  Controller,
  Delete,
  HttpCode,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFile,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { handle } from '../../helpers/response/handle';
import { FileService } from './file.service';
import { CommonApiResponse } from '../../helpers/decorators/api-response-swagger.decorator';
import { Auth } from '../../helpers/decorators/auth.decorator';
import { fileFilter } from '../../helpers/file/image-filter';
import { Role } from '../../common/enums/enum';
import { FileDto } from './dto/file.dto';
import { abiBodyOptionsFileUpload } from './swagger/api-body-options';
import { HttpExceptionFilter } from '../../helpers/filters/http-exception.filter';
import { MAX_FILE_SIZE_1000MB } from '../../common/constants';

@ApiTags('file')
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  @Auth(Role.Artist, Role.User)
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody(abiBodyOptionsFileUpload)
  @CommonApiResponse(FileDto)
  @ApiResponse({ status: 422, description: 'Not valid file type' })
  @HttpCode(200)
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: MAX_FILE_SIZE_1000MB }),
        ],
      }),
    )
    file: any,
  ) {
    return handle(
      await this.fileService.uploadFile(
        file.buffer,
        file.originalname,
        file.mimetype,
      ),
    );
  }

  @Patch(':id')
  @Auth(Role.Artist, Role.User)
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody(abiBodyOptionsFileUpload)
  @CommonApiResponse(FileDto)
  @ApiResponse({ status: 422, description: 'Not valid file type' })
  async updateFile(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: MAX_FILE_SIZE_1000MB }),
        ],
      }),
    )
    file: any,
  ) {
    return handle(
      await this.fileService.putFile(
        id,
        file.buffer,
        file.originalname,
        file.mimetype,
      ),
    );
  }

  @Delete(':id')
  @Auth(Role.Artist, Role.User)
  @UseFilters(new HttpExceptionFilter())
  @CommonApiResponse(String)
  async remove(@Param('id') id: string) {
    return handle(await this.fileService.remove(id));
  }
}
