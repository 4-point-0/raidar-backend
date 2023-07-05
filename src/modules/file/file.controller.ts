import {
  Controller,
  Delete,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { handle } from '../../helpers/response/handle';
import { FileService } from './file.service';
import { AuthRequest } from '../auth/types/auth-request.type';
import { CommonApiResponse } from '../../helpers/decorators/api-response-swagger.decorator';
import { Auth } from '../../helpers/decorators/auth.decorator';
import { fileFilter } from '../../helpers/file/image-filter';
import { Role } from '@prisma/client';
import { FileDto } from './dto/file.dto';
import { FileExtender } from '../../helpers/file/file-extender';
import { abiBodyOptionsFileUpload } from './swagger/api-body-options';
import { HttpExceptionFilter } from '../../helpers/filters/http-exception.filter';
import { MAX_FILE_SIZE_20MB } from '../../common/constants';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@ApiTags('file')
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  @Auth(Role.Admin, Role.Member)
  @UseInterceptors(FileExtender)
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody(abiBodyOptionsFileUpload)
  @CommonApiResponse(FileDto)
  @ApiResponse({ status: 422, description: 'Not valid file type' })
  async uploadFile(
    @Req() request: AuthRequest,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: MAX_FILE_SIZE_20MB })],
      }),
    )
    file: any,
  ) {
    return handle(
      await this.fileService.uploadFile(
        request.user.id,
        request.user.organization_id,
        file.buffer,
        file.originalname,
        file.mimetype,
        file.tags,
      ),
    );
  }

  @Patch(':id')
  @Auth(Role.Admin, Role.Member)
  @UseInterceptors(FileExtender)
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
    @Req() request: AuthRequest,
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: MAX_FILE_SIZE_20MB })],
      }),
    )
    file: any,
  ) {
    return handle(
      await this.fileService.putFile(
        request.user.id,
        request.user.organization_id,
        id,
        file.buffer,
        file.originalname,
        file.mimetype,
        file.tags,
      ),
    );
  }

  @Delete(':id')
  @Auth(Role.Admin, Role.Member)
  @UseFilters(new HttpExceptionFilter())
  @CommonApiResponse(String)
  async remove(@Req() request: AuthRequest, @Param('id') id: string) {
    return handle(
      await this.fileService.remove(id, request.user.organization_id),
    );
  }
}
