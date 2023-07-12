import { ApiProperty } from '@nestjs/swagger';

export class CronJobDto {
  @ApiProperty({
    type: String,
  })
  name: string;
  @ApiProperty({
    type: String,
  })
  nextRun: string;

  @ApiProperty({
    type: Boolean,
  })
  isRunning: boolean;
}
