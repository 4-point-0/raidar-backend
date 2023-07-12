import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ServerError } from '../../helpers/response/errors';
import { ServiceResult } from '../../helpers/response/result';
import { EmailDto } from './dto/email.dto';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const sgMail = require('@sendgrid/mail');

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly configService: ConfigService) {}

  async send(dto: EmailDto): Promise<ServiceResult<boolean>> {
    try {
      sgMail.setApiKey(this.configService.get('sendgrid.api_key'));

      const msg = {
        to: dto.to,
        from: dto.from,
        subject: dto.subject,
        html: dto.html,
      };

      await sgMail.send(msg);
    } catch (error) {
      this.logger.error('EmailService - send', error);
      return new ServerError<boolean>(error.message);
    }
  }
}
