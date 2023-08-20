import { Body, Controller, Post, Session } from '@nestjs/common';
import { Builder } from 'builder-pattern';
import { AuthService } from './auth.service';
import { AuthMailDto } from './dto/auth-mail.dto';
import { AuthMailReqDto } from './dto/auth-mail-req.dto';
import { AuthPhoneReqDto } from './dto/auth-phone-req.dto';
import { AuthPhoneDto } from './dto/auth-phone.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
}
