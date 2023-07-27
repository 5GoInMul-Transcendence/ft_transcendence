import { Controller, Post } from '@nestjs/common';
import { LoginService } from './login.service';

@Controller('login')
export class LoginController {
  constructor(private loginService: LoginService) {}

  @Post('/oauth/42')
  loginOAuth42() {
    // return this.loginService(this.loginService());
  }
}
