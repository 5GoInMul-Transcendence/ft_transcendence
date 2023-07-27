import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { generateRandomCode } from '../auth.helper';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  constructor(private readonly mailerService: MailerService) {}
  private async _send(
    to: string,
    subject: string,
    template: string,
    context: any = {},
  ) {
    await this.mailerService
      .sendMail({ to, subject, template, context })
      .catch((error) => {
        this.logger.error(error);
        throw new HttpException(
          '다시 시도 바랍니다.',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      });
  }

  // 메일 인증코드 보내기
  async sendMail(email: string) {
    const code = generateRandomCode();
    await this._send(email, '[Pong] 메일 인증', 'authenticate.mail.ejs', { code });
    return code;
  }
}
