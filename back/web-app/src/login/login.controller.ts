import { Controller, Get, Req, Session, UseGuards } from '@nestjs/common';
import { LoginService } from './login.service';
import { FortyTwoAuthGuard } from './ft-auth.guard';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';
import { CreateSignupOauthDto } from 'src/user/dto/create-signup-oauth.dto';
import { Builder } from 'builder-pattern';
import { SignupOauth } from 'src/user/signup-oauth.entity';

@Controller('login')
export class LoginController {
  constructor(
    private loginService: LoginService,
    private userService: UserService,
  ) {}

  @Get('oauth/42')
  @UseGuards(FortyTwoAuthGuard)
  ftAuth(@Req() req: any) {}

  @Get('oauth/42/redirect')
  @UseGuards(FortyTwoAuthGuard)
  async ftAuthRedirect(
    @Req() req: any,
    @Session() session: Record<string, any>,
    ): Promise<User> {
    const reqUser: any = req.user;
    let user: User;
    let oauthUser: SignupOauth;

    // get user from memoryOauthUser
    oauthUser = await this.userService.getOauthUserByProfileId(reqUser.id);
    user = oauthUser.user;

    if (!user) {
      // add memoryUser
      // add memoryOauthUser
      user = await this.userService.createUser(reqUser);
      this.userService.createSignupOauth(Builder(CreateSignupOauthDto)
      .user(user)
      .profileId(reqUser.id)
      .build()); 
    }
    else {
      // 다른 브라우저에서 접근했을 때 이전 세션을 만료 시키고, 현재 요청의 세션으로 업데이트?
    }
  
    if (this.loginService.isTwoFaOn(user.twoFactor) == true) {
      // 2FA
    }
    session.userId = user.id;
    return user; // /main 리다이렉트 필요
  }
}