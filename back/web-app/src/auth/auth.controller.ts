import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Session,
} from '@nestjs/common';
import { Builder } from 'builder-pattern';
import { AuthService } from './auth.service';
import { AuthMailDto } from './dto/auth-mail.dto';
import { AuthMailReqDto } from './dto/auth-mail-req.dto';
import { AuthPhoneReqDto } from './dto/auth-phone-req.dto';
import { AuthPhoneDto } from './dto/auth-phone.dto';
import { CheckAuthCodeReqDto } from './dto/check-auth-code-req.dto';
import { CheckAuthCodeDto } from './dto/check-auth-code.dto';
import { RedirectResource } from '../common/response/redirect-resource.enum';
import { SessionService } from '../session/session.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private sessionService: SessionService,
  ) {}

  @Post('mail')
  authMail(@Session() session, @Body() dto: AuthMailReqDto) {
    this.authService.authMail(
      Builder(AuthMailDto).userId(session.userId).mail(dto.mail).build(),
    );
  }

  @Post('phone')
  authPhone(@Session() session, @Body() dto: AuthPhoneReqDto) {
    this.authService.authPhone(
      Builder(AuthPhoneDto).userId(session.userId).phone(dto.phone).build(),
    );
  }

  @Post()
  checkAuthCode(@Session() session, @Body() dto: CheckAuthCodeReqDto) {
    this.authService.checkAuthCode(
      Builder(CheckAuthCodeDto).userId(session.userId).code(dto.code).build(),
    );
  }

  @Post('2fa')
  @HttpCode(HttpStatus.FOUND)
  checkAuthCodeBy2faLogin(
    @Session() session,
    @Body() dto: CheckAuthCodeReqDto,
  ) {
    this.authService.checkAuthCode(
      Builder(CheckAuthCodeDto)
        .userId(session.tempUserId)
        .code(dto.code)
        .build(),
    );

    delete session.tempUserId;
    this.sessionService.setSession(session, session.tempUserId);

    return RedirectResource.MAIN;
  }
}
