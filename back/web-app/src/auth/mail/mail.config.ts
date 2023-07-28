import { Injectable, Module } from '@nestjs/common';
import { MailerOptionsFactory, MailerOptions } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailConfig implements MailerOptionsFactory {
  constructor(private readonly configService: ConfigService) {}
  createMailerOptions(): MailerOptions {
    const email = this.configService.get('EMAIL');
    const emailPassword = this.configService.get('EMAIL_PASSWORD');
    const emailHost = this.configService.get('EMAIL_HOST_GOOGLE');
    const fromName = this.configService.get('EMAIL_FROM_USER_NAME');

    return {
      transport: `smtps://${email}:${emailPassword}@${emailHost}`,
      defaults: {
        from: `"${fromName}" <${email}>`,
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
