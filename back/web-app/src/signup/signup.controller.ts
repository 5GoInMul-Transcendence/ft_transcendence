import { Body, Controller, HttpCode, HttpException, HttpStatus, Post } from '@nestjs/common';
import { UserService } from 'src/users/user/user.service';
import { Builder } from 'builder-pattern';
import { CreateMemberUserDto } from 'src/users/user/dto/create-member-user.dto';
import { User } from 'src/users/user/entities/user.entity';
import { MemoryUserService } from 'src/users/memoryuser/memory-user.service';
import { RedirectResource } from 'src/common/response/redirect-resource.enum';
import { SignupMemberRepDto } from './dto/signup-member-req.dto';
import { MemberUser } from 'src/users/user/entities/member-user.entity';
import { CreateUserDto } from 'src/users/user/dto/create-user.dto';
import { UserDto } from 'src/users/user/dto/user.dto';
import { SignupService } from './signup.service';

@Controller('signup')
export class SignupController {
  constructor(
    private userService: UserService,
    private memoryUserService: MemoryUserService,
    private signupService: SignupService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.FOUND)
  async signupMember(@Body() signupMemberReqDto: SignupMemberRepDto) { // dto pipe 검사
    // users = getMemberUserByIdInMemor(signupMemberReqDto) .  users 에 entity 만들기
    const { id, password } = signupMemberReqDto;
    let memberUser: MemberUser;
    let user: User;

    memberUser = await this.userService.getMemberUserByAccountId(id)
    if (memberUser) {
      throw new HttpException("이미 등록된 아이디입니다.", HttpStatus.OK);
    }
    // avatar 랜덤생성

    user = await this.userService.createUser(
      Builder(CreateUserDto)
      .mail(null)
      .nickname(this.signupService.getRandomNickname()) // generate random ID
      .build()
    );

    this.memoryUserService.addUser(
      Builder(UserDto)
      .avatar(user.avatar)
      .mail(user.mail)
      .nickname(user.nickname)
      .phone(user.phone)
      .twoFactor(user.twoFactor)
      .userId(user.id)
      .build()
    );

    this.userService.createSignupMember(
      Builder(CreateMemberUserDto)
      .user(user)
      .id(id)
      .password(await this.signupService.hashMemberPassword(password))
      .build()
    );

    return RedirectResource.LOGIN;
  }
}
