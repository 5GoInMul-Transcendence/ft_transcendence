import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { LoginService } from './login.service';
import { FortyTwoAuthGuard } from './ft-auth.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  // @Get()
  // @UseGuards(FortyTwoAuthGuard)
  // async ftAuth(@Req() req: any) {}

  @Get('redirect')
  @UseGuards(AuthGuard('ft'))
  ftAuthRedirect(@Req() req: any) {

    console.log(req.profile);
    return this.loginService.ftLogin(req)
  }
}