import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseFilters,
  HttpCode,
  Body,
  Req,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiConsumes,
  ApiBody,
  ApiResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ContractService } from './contract.service';
import { Auth } from '../../helpers/decorators/auth.decorator';
import { Role } from '../../common/enums/enum';
import { ContractDto } from './dto/contract.dto';
import { CreateContractDto } from './dto/create-contract.dto';
import { AuthRequest } from '../../common/types/auth-request.type';
import { CommonApiResponse } from '../../helpers/decorators/api-response-swagger.decorator';
import { HttpExceptionFilter } from '../../helpers/filters/http-exception.filter';
import { ApiPaginatedResponse } from '../../common/pagination/api-paginated-response';
import { fileFilter } from '../../helpers/file/image-filter';
import { apiBodyOptionsCreateContract } from './swagger/api-body-options';

@ApiTags('contract')
@Controller('contract')
@UseFilters(new HttpExceptionFilter())
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Post()
  @Auth(Role.Artist, Role.User)
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody(apiBodyOptionsCreateContract)
  @ApiResponse({ status: 422, description: 'Not valid file type' })
  @CommonApiResponse(ContractDto)
  @HttpCode(200)
  async createContract(
    @Req() request: AuthRequest,
    @UploadedFile() file: Express.Multer.File,
    @Body() createContractDto: CreateContractDto,
  ) {
    return this.contractService.createContract(
      request.user,
      createContractDto,
      file,
    );
  }

  @Get(':id')
  @Auth(Role.Artist, Role.User)
  @CommonApiResponse(ContractDto)
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    description: 'Contract ID',
  })
  async findOne(@Param('id') id: string) {
    return this.contractService.findContractById(id);
  }

  @Get('artist/base')
  @Auth(Role.Artist)
  @ApiPaginatedResponse(ContractDto)
  @ApiOperation({ summary: 'Get paginated base contracts for an artist' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAllBaseArtistContracts(
    @Req() request: AuthRequest,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.contractService.findAllBaseContractsByArtist(request.user.id, {
      page,
      limit,
    });
  }

  @Get('artist/signed')
  @Auth(Role.Artist)
  @ApiPaginatedResponse(ContractDto)
  @ApiOperation({ summary: 'Get paginated signed contracts for an artist' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAllSignedArtistContracts(
    @Req() request: AuthRequest,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.contractService.findAllSignedContractsByArtist(
      request.user.id,
      { page, limit },
    );
  }

  @Get('user/signed')
  @Auth(Role.User)
  @ApiPaginatedResponse(ContractDto)
  @ApiOperation({ summary: 'Get paginated contracts for a user' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAllUserContracts(
    @Req() request: AuthRequest,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.contractService.findAllContractsByUser(request.user.id, {
      page,
      limit,
    });
  }
}
