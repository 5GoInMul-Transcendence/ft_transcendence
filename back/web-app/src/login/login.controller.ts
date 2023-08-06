import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { LoginService } from './login.service';
import { FortyTwoAuthGuard } from './ft-auth.guard';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';

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
  ftAuthRedirect(@Req() req: any): Promise<User> {
    const user: any = req.user;

    this.userService.createSignupOauth(user);
    return this.userService.createUser(user);
  }
}