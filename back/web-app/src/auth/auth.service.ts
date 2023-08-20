import { Injectable } from '@nestjs/common';
import { AuthInfo } from './auth-info';
import { MailService } from './mail/mail.service';
import { AuthMailDto } from './dto/auth-mail.dto';
import { Builder } from 'builder-pattern';
import { TwoFactorStatus } from '../users/enums/twoFactor-status.enum';

@Injectable()
export class AuthService {
  private authInfos: Map<number, AuthInfo>;

  constructor(private mailService: MailService) {
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
}
