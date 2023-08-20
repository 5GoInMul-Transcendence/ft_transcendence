import { Body, Controller, HttpCode, HttpException, HttpStatus, Post } from '@nestjs/common';
import { UserService } from 'src/users/user/user.service';
import { Builder } from 'builder-pattern';
import { CreateMemberUserDto } from 'src/users/user/dto/create-member-user.dto';
import { User } from 'src/users/user/entities/user.entity';
import { MemoryUserService } from 'src/users/memoryuser/memory-user.service';
import { RedirectResource } from 'src/common/response/redirect-resource.enum';
import { SignupMemberRepDto } from './dto/signup-member-req.dto';
import { MemberUser } from 'src/users/user/entities/member-user.entity';

@Controller('signup')
export class SignupController {
  constructor(
    private userService: UserService,
    private memoryUserService: MemoryUserService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.FOUND)
  async signupMember(@Body() signupMemberReqDto: SignupMemberRepDto) { // dto pipe 검사
    // users = getMemberUserByIdInMemor(signupMemberReqDto) .  users 에 entity 만들기
    const { id, password } = signupMemberReqDto;
    let memberUser: MemberUser;
    let user: User;
    // User 테이블에 저장 후 리턴 받을 변수

    memberUser = await this.userService.getMemberUserByAccountId(id)
    if (memberUser) {
      throw new HttpException("이미 등록된 아이디입니다.", HttpStatus.OK);
    }
    // nickname, avatar 랜덤생성
    // 비밀번호 해시화 후 저장

    user = await this.userService.createUser(null);

    this.userService.createSignupMember(
      Builder(CreateMemberUserDto)
      .user(user)
      .id(id) // change
      .password(password) // 해시와 필요
      .build()
    );

    return RedirectResource.LOGIN;
  }
}
