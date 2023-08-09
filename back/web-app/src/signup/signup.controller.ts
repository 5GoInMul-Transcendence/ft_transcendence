import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { Builder } from 'builder-pattern';
import { CreateSignupMemberDto } from 'src/user/dto/create-signup-member.dto';
import { SignupMember } from 'src/user/signup-member.entity';
import { User } from 'src/user/user.entity';

@Controller('signup')
export class SignupController {
  constructor(private userService: UserService) {}

  @Post()
  async signupMember(@Body() createSignupMemberDto: CreateSignupMemberDto) { // dto pipe 검사
    // user = getMemberUserByIdInMemor(createSignupMemberDto) .  user 에 entity 만들기
    const { id, password, user } = createSignupMemberDto;
    const memberUser = await this.userService.getMemberUserById(id);
    let savedUser: User;
    // User 테이블에 저장 후 리턴 받을 변수

    if (memberUser) {
      // throw 이미 있는 경우 예외
      return 'Member user 가 이미 존재합니다!';
    }
    // nickname, avatar 랜덤생성
    // 비밀번호 해시화 후 저장

    // 왜 SignupMember 타입 변수는 안 되고, Promise<SignupMember> 티입 변수로만 반환 받아야 하나
    this.userService.createSignupMember(Builder
      (CreateSignupMemberDto)
      .id(id) // change
      .password(password)
      .user(user)
      .build())
      savedUser = await this.userService.createUser(null);
      console.log('saveUser', savedUser);
      return savedUser;
    // redirection 200, /login
  }
}
