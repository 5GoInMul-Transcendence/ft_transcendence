import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { LoginService } from './login.service';
import { FortyTwoAuthGuard } from './ft-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from 'src/user/user.service';

@Controller('login')
export class LoginController {
  constructor(
    private loginService: LoginService,
    private userService: UserService,
  ) {}

  @Get()
  @UseGuards(FortyTwoAuthGuard) // Guards 의 역할은?
  ftAuth(@Req() req: any) {} // async 일 필요 있나?

  @Get('redirect')
  @UseGuards(FortyTwoAuthGuard)
  ftAuthRedirect(@Req() req: any) {
    const user: any = req.user;

    // console.log('user', user);

    // return this.loginService.ftLogin(req);
  }
}