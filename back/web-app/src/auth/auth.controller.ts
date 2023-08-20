import { Body, Controller, Post, Session } from '@nestjs/common';
import { Builder } from 'builder-pattern';
import { AuthService } from './auth.service';
import { AuthMailDto } from './dto/auth-mail.dto';
import { AuthMailReqDto } from './dto/auth-mail-req.dto';
import { CheckAuthCodeReqDto } from './dto/check-auth-code-req.dto';
import { CheckAuthCodeDto } from './dto/check-auth-code.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('mail')
  authMail(@Session() session, @Body() dto: AuthMailReqDto) {
    this.authService.authMail(
      Builder(AuthMailDto).userId(session.userId).mail(dto.mail).build(),
    );
  }

  @Post()
  checkAuthCode(@Session() session, @Body() dto: CheckAuthCodeReqDto) {
    this.authService.checkAuthCode(
      Builder(CheckAuthCodeDto).userId(session.userId).code(dto.code).build(),
    );
  }
}
