import {Injectable, Module} from '@nestjs/common';
import { MailerOptionsFactory, MailerOptions } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerConfigService implements MailerOptionsFactory {
  constructor(private readonly configService: ConfigService) {}
  createMailerOptions(): MailerOptions {
    return {
      transport: `smtps://${this.configService.get('EMAIL')}:${this.configService.get('EMAIL_PASSWORD')}@${this.configService.get('EMAIL_HOST_GOOGLE')}`,
      defaults: {
        from: `"${this.configService.get('EMAIL_FROM_USER_NAME')}" <${this.configService.get('EMAIL')}>`,
      },
      template: {
        dir: __dirname + '/../../templates',
        adapter: new EjsAdapter(),
        options: {
          strict: true,
        },
      },
    };
  }
}
