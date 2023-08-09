import { Body, Controller, Get, Req, Session, UseGuards } from '@nestjs/common';
import { LoginService } from './login.service';
import { FortyTwoAuthGuard } from './ft-auth.guard';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';
import { CreateSignupOauthDto } from 'src/user/dto/create-signup-oauth.dto';
import { Builder } from 'builder-pattern';
import { SignupOauth } from 'src/user/signup-oauth.entity';
import { SessionService } from 'src/session/session.service';

@Controller('login')
export class LoginController {
  constructor(
    private loginService: LoginService,
    private userService: UserService,
    private sessionService: SessionService,
  ) {}

  // @Get()
  // loginMemer(@Body()) {

  // }

  @Get('oauth/42')
  @UseGuards(FortyTwoAuthGuard)
  ftAuth(@Req() req: any) {}

  @Get('oauth/42/redirect') // 302 redirect
  @UseGuards(FortyTwoAuthGuard)
  async ftAuthRedirect(
    @Req() req: any, // 유효성 검사 해야 하나?
    @Session() session: Record<string, any>,
    ): Promise<User> {
    const reqUser: any = req.user;
    let user: User;
    let oauthUser: SignupOauth;

    // get user from memoryOauthUser
    oauthUser = await this.userService.getOauthUserByProfileId(reqUser.id);
    user = oauthUser?.user; // 유저가 없었다면 oauthUser 는 null 이다.
    if (!user) {
      // add memoryUser
      // add memoryOauthUser
      user = await this.userService.createUser(reqUser.mail);
      this.userService.createSignupOauth(Builder(CreateSignupOauthDto)
      .user(user)
      .profileId(reqUser.id)
      .build()); 
    }
  
    if (this.loginService.isTwoFaOn(user.twoFactor) == true) {
      // 2FA
      // 세션만 생성하고, userId 는 넣어주면 안 됨
    }
    this.sessionService.setSession(session, user.id);
    return user; // Need to redirecte 200, /main
  }
}