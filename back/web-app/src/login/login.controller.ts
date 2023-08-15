import { Controller, Get, HttpCode, HttpStatus, Post, Req, Session, UseGuards } from '@nestjs/common';
import { LoginService } from './login.service';
import { FortyTwoAuthGuard } from './ft-auth.guard';
import { UserService } from 'src/users/user/user.service';
import { User } from 'src/users/user/entities/user.entity';
import { Builder } from 'builder-pattern';
import { OauthUser } from 'src/users/user/entities/oauth-user.entity';
import { SessionService } from 'src/session/session.service';
import { CreateOauthUserDto } from 'src/users/user/dto/create-oauth-user.dto';
import { RedirectResource } from 'src/common/response/redirect-resource.enum';

@Controller('login')
export class LoginController {
  constructor(
    private loginService: LoginService,
    private userService: UserService,
    private sessionService: SessionService,
  ) {}

  @Get('oauth/42') // POST 요청으로 변경해야 함
  @UseGuards(FortyTwoAuthGuard)
  ftAuth() {}

  @Get('oauth/42/redirect') // 302 redirect
  @UseGuards(FortyTwoAuthGuard)
  @HttpCode(HttpStatus.FOUND)
  async ftAuthRedirect(
    @Req() req: any, // 유효성 검사 해야 하나?
    @Session() session: Record<string, any>,
    ): Promise<string> {
    const reqUser: any = req.user;
    let user: User;
    let oauthUser: OauthUser;

    // get users from memoryOauthUser
    oauthUser = await this.userService.getOauthUserByProfileId(reqUser.id);
    user = oauthUser?.user; // 유저가 없었다면 oauthUser 는 null 이다.
    if (!user) {
      // add memoryUser
      // add memoryOauthUser
      user = await this.userService.createUser(reqUser.mail);
      this.userService.createSignupOauth(
        Builder(CreateOauthUserDto)
        .user(user)
        .profileId(reqUser.id)
        .build()
      ); 
    }
  
    if (this.loginService.isTwoFaOn(user.twoFactor) == true) {
      // 2FA
      // 세션만 생성하고, userId 는 넣어주면 안 됨
    }
    this.sessionService.setSession(session, user.id);
    // return users; // Need to redirecte 200, /main
    return RedirectResource.MAIN;
  }
}