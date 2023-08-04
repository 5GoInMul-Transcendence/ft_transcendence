import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { LoginService } from './login.service';
import { FortyTwoAuthGuard } from './ft-auth.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Get()
  @UseGuards(FortyTwoAuthGuard) // Guards 의 역할은?
  async ftAuth(@Req() req: any) {} // async 일 필요 있나?

  @Get('redirect')
  @UseGuards(FortyTwoAuthGuard)
  ftAuthRedirect(@Req() req: any): {message: string; user: any} {
    console.log(req.user);
    return this.loginService.ftLogin(req)
  }
}