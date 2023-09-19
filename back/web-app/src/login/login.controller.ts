import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  Session,
  UseGuards,
  Redirect,
} from '@nestjs/common';
import { LoginService } from './login.service';
import { FortyTwoAuthGuard } from './ft-auth.guard';
import { UserService } from 'src/users/user/user.service';
import { User } from 'src/users/user/entities/user.entity';
import { Builder } from 'builder-pattern';
import { OauthUser } from 'src/users/user/entities/oauth-user.entity';
import { SessionService } from 'src/session/session.service';
import { CreateOauthUserDto } from 'src/users/user/dto/create-oauth-user.dto';
import { RedirectResource } from 'src/common/response/redirect-resource.enum';
import { LoginMemberUserReqDto } from './dto/login-member-user-req.dto';
import { MemberUser } from 'src/users/user/entities/member-user.entity';
import { MemoryUserService } from 'src/users/memoryuser/memory-user.service';
import { UserDto } from 'src/users/user/dto/user.dto';
import { CreateUserDto } from 'src/users/user/dto/create-user.dto';
import { SignupService } from 'src/signup/signup.service';
import { HashService } from 'src/common/hash/hash.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('login')
export class LoginController {
  constructor(
    private loginService: LoginService,
    private userService: UserService,
    private sessionService: SessionService,
    private memoryUserService: MemoryUserService,
    private signupService: SignupService,
    private hashService: HashService,
    private configService: ConfigService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.FOUND)
  async loginMemberUser(
    @Body() loginMemberUserReqDto: LoginMemberUserReqDto,
    @Session() session: Record<string, any>,
  ) {
    const { id, password } = loginMemberUserReqDto;
    let memberUser: MemberUser;

    memberUser = await this.userService.getMemberUserByAccountId(id);
    if (!memberUser) {
      throw new HttpException(
        '아이디 또는 비밀번호가 올바르지 않습니다!',
        HttpStatus.OK,
      );
    }

    const isCorrectPassword = await this.hashService.hashCompare(password, memberUser.password);

    if (!isCorrectPassword) {
      throw new HttpException(
        '아이디 또는 비밀번호가 올바르지 않습니다!',
        HttpStatus.OK,
      );
    }

    if (this.loginService.checkTwoFactorOn(memberUser.user.id)) {
      session.tempUserId = memberUser.user.id;
      return RedirectResource.TWOFACTOR;
    }

    this.sessionService.setSession(session, memberUser.user.id);
    return RedirectResource.PROFILE_EDIT;
  }

  @Get('oauth/42')
  @UseGuards(FortyTwoAuthGuard)
  ftAuth() {}

  @Get('oauth/42/redirect')
  @UseGuards(FortyTwoAuthGuard)
  async ftAuthRedirect(
    @Req() req: any, // 유효성 검사 해야 하나?
    @Res() res: Response,
    @Session() session: Record<string, any>,
  ): Promise<void> {
    const reqUser: any = req.user;
    let user: User;
    let oauthUser: OauthUser;

    // get users from memoryOauthUser
    oauthUser = await this.userService.getOauthUserByProfileId(reqUser.id);
    user = oauthUser?.user; // 유저가 없었다면 oauthUser 는 null 이다.
    if (!user) {
      user = await this.userService.createUser(
        Builder(CreateUserDto)
          .mail(reqUser.mail)
          .nickname(this.signupService.getRandomNickname())
          .build(),
      );
      this.userService.createSignupOauth(
        Builder(CreateOauthUserDto).user(user).profileId(reqUser.id).build(),
      );
      this.memoryUserService.addUser(
        Builder(UserDto)
          .avatar(user.avatar)
          .mail(user.mail)
          .nickname(user.nickname)
          .phone(user.phone)
          .twoFactor(user.twoFactor)
          .userId(user.id)
          .build(),
      );
    }

    if (this.loginService.checkTwoFactorOn(user.id)) {
      session.tempUserId = user.id;
      res.redirect(this.configService.get('FRONT_URL') + RedirectResource.TWOFACTOR);
    }

    this.sessionService.setSession(session, user.id);
    res.redirect(this.configService.get('FRONT_URL') + RedirectResource.PROFILE_EDIT);
  }
}
