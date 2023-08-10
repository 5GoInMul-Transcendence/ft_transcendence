import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { Builder } from 'builder-pattern';
import { CreateMemberUserDto } from 'src/user/dto/create-member-user.dto';
import { MemberUser } from 'src/user/member-user.entity';
import { User } from 'src/user/user.entity';

@Controller('signup')
export class SignupController {
  constructor(private userService: UserService) {}

  @Post()
  async signupMember(@Body() createMemberUserDto: CreateMemberUserDto) { // dto pipe 검사
    // user = getMemberUserByIdInMemor(createMemberUserDto) .  user 에 entity 만들기
    const { id, password, user } = createMemberUserDto;
    const memberUser = await this.userService.getMemberUserById(id);
    let savedUser: User;
    // User 테이블에 저장 후 리턴 받을 변수

    if (memberUser) {
      // throw 이미 있는 경우 예외
      return 'Member user 가 이미 존재합니다!';
    }
    // nickname, avatar 랜덤생성
    // 비밀번호 해시화 후 저장

    this.userService.createSignupMember(Builder
      (CreateMemberUserDto)
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
