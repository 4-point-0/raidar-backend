import { CronJob } from 'cron';
import { CronJobDto } from '../dto/cron-job.dto';

export const mapCronToDto = (job: CronJob, name: string): CronJobDto => {
  return {
    name: name,
    nextRun: job.running ? job.nextDate().toString() : undefined,
    isRunning: job.running ? true : false,
  };
};
