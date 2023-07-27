import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { ConfigService } from '@nestjs/config';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          transport: `smtps://${config.get('EMAIL')}:${config.get('EMAIL_PASSWORD')}@${config.get('EMAIL_HOST_GOOGLE')}`,
          defaults: {
            from: `"${config.get('EMAIL_FROM_USER_NAME')}" <${config.get('EMAIL')}>`,
          },
          template: {
            dir: __dirname + '/../../templates',
            adapter: new EjsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
