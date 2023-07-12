import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UseFilters,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from '../../helpers/filters/http-exception.filter';
import { TaskService } from './task.service';
import { StartCronJobDto } from './dto/start-cron-job.dto';
import { handle } from '../../helpers/response/handle';
import { CronJobDto } from './dto/cron-job.dto';
import { SetCronTimeDto } from './dto/set-cron-time.dto';
import { CommonApiResponse } from '../../helpers/decorators/api-response-swagger.decorator';
import { Auth } from '../../helpers/decorators/auth.decorator';
import { Role } from '../../common/enums/enum';

@ApiTags('tasks')
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  @UseFilters(new HttpExceptionFilter())
  @Auth(Role.Admin)
  @CommonApiResponse([CronJobDto])
  async getAll() {
    return handle(this.taskService.getCrons());
  }

  @Post(':name/start')
  @Auth(Role.Admin)
  @UseFilters(new HttpExceptionFilter())
  @CommonApiResponse(Boolean)
  @HttpCode(200)
  async startCronJob(
    @Param('name') name: string,
    @Body() dto: StartCronJobDto,
  ) {
    return handle(await this.taskService.startCronJob(name, dto.start));
  }

  @Post(':name/set-time')
  @Auth(Role.Admin)
  @UseFilters(new HttpExceptionFilter())
  @CommonApiResponse(Boolean)
  @HttpCode(200)
  async setCronTime(@Param('name') name: string, @Body() dto: SetCronTimeDto) {
    return handle(this.taskService.setCronJobTime(name, dto.cronTime));
  }

  @Get(':name')
  @Auth(Role.Admin)
  @UseFilters(new HttpExceptionFilter())
  @CommonApiResponse(CronJobDto)
  async findOne(@Param('name') name: string) {
    return handle(this.taskService.getCronJob(name));
  }
}
