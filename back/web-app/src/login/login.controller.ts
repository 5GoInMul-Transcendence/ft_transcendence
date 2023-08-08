import { Controller, Get, Req, Session, UseGuards } from '@nestjs/common';
import { LoginService } from './login.service';
import { FortyTwoAuthGuard } from './ft-auth.guard';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';
import { CreateSignupOauthDto } from 'src/user/dto/create-signup-oauth.dto';
import { Builder } from 'builder-pattern';

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
  async ftAuthRedirect(
    @Req() req: any,
    @Session() session: Record<string, any>): Promise<User> {
    const reqUser: any = req.user;
    let user: User;

    console.log('session', session);

    // get user from memoryUser

    if (1) { // if (!user) {
      // add memoryUser

      // user = await this.userService.createUser(reqUser);
      // this.userService.createSignupOauth(Builder(CreateSignupOauthDto)
      // .id(reqUser.id)
      // .user(user)
      // .build()); 
    }
  
    // if (this.loginService.isTwoFaOn(user.twoFactor) == true) {

    // }
    // session 생성
    return user;
  }
}