import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthInfo } from './auth-info';
import { MailService } from './mail/mail.service';
import { AuthMailDto } from './dto/auth-mail.dto';
import { Builder } from 'builder-pattern';
import { TwoFactorStatus } from '../users/enums/twoFactor-status.enum';
import { AuthPhoneDto } from './dto/auth-phone.dto';
import { SmsService } from './sms/sms.service';
import { CheckAuthCodeDto } from './dto/check-auth-code.dto';
import { UpdateMemoryUserDto } from '../users/memoryuser/dto/update-memory-user.dto';
import { UserService } from '../users/user/user.service';

@Injectable()
export class AuthService {
  private authInfos: Map<number, AuthInfo>;

  constructor(
    private mailService: MailService,
    private smsService: SmsService,
    private userService: UserService,
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

  checkAuthCode(dto: CheckAuthCodeDto) {
    const authInfo = this.authInfos.get(dto.userId);

    if (!authInfo) {
      throw new HttpException('잘못된 요청입니다.', HttpStatus.OK);
    }

    if (authInfo.code != dto.code) {
      throw new HttpException('잘못된 인증코드입니다.', HttpStatus.OK);
    }

    if (authInfo.modifyValue) {
      if (authInfo.twoFactor == TwoFactorStatus.MAIL) {
        this.userService.updateUser(
          Builder(UpdateMemoryUserDto)
            .userId(dto.userId)
            .mail(authInfo.modifyValue)
            .build(),
        );
      }

      if (authInfo.twoFactor == TwoFactorStatus.PHONE) {
        this.userService.updateUser(
          Builder(UpdateMemoryUserDto)
            .userId(dto.userId)
            .phone(authInfo.modifyValue)
            .build(),
        );
      }
    }

    this.authInfos.delete(dto.userId);
  }
}
