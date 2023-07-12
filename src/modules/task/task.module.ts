import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { CoingeckoModule } from '../coingecko/coingecko.module';

@Module({
  imports: [CoingeckoModule],
  exports: [TaskService],
  providers: [TaskService],
  controllers: [TaskController],
})
export class TasksModule {}
