import { Injectable } from '@nestjs/common';
import { AuthInfo } from './auth-info';
import { MailService } from './mail/mail.service';
import { AuthMailDto } from './dto/auth-mail.dto';
import { Builder } from 'builder-pattern';
import { TwoFactorStatus } from '../users/enums/twoFactor-status.enum';
import { AuthPhoneDto } from './dto/auth-phone.dto';
import { SmsService } from './sms/sms.service';

@Injectable()
export class AuthService {
  private authInfos: Map<number, AuthInfo>;

  constructor(
    private mailService: MailService,
    private smsService: SmsService,
  ) {
    this.authInfos = new Map<number, AuthInfo>();
  }

  async authMail(dto: AuthMailDto) {
    const code = await this.mailService.sendMail(dto.mail);

    this.authInfos.set(
      dto.userId,
      Builder(AuthInfo)
        .twoFactor(TwoFactorStatus.MAIL)
        .modifyValue(dto.mail)
        .code(code)
        .build(),
    );
  }
  async authPhone(dto: AuthPhoneDto) {
    const code = await this.smsService.sendSMS(dto.phone);

    this.authInfos.set(
      dto.userId,
      Builder(AuthInfo)
        .twoFactor(TwoFactorStatus.PHONE)
        .modifyValue(dto.phone)
        .code(code)
        .build(),
    );
  }
}
