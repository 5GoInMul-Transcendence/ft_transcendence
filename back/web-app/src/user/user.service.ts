import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { randomUUID } from 'crypto';
import { CreateSignupOauthDto } from './dto/create-signup-oauth.dto';
import { SignupOauth } from './signup-oauth.entity';
import { CreateSignupMemberDto } from './dto/create-signup-member.dto';
import { SignupMember } from './signup-member.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(SignupOauth)
    private signupOauthRepository: Repository<SignupOauth>,
    @InjectRepository(SignupMember)
    private signupMemberRepository: Repository<SignupMember>,
  ) {}

  async getOauthUserByProfileId(profileId: number): Promise<SignupOauth> {
    return await this.signupOauthRepository.findOne({
      where: {
        profileId
      },
      relations: {
        user: true // 기본값은 false
      },
    });
  }

  async getMemberUserById(id: string): Promise<SignupMember> {
    return await this.signupMemberRepository.findOne({
      where: {
        id,
      },
      relations: {
        user: true,
      },
    });
  }

  // async getUserById(id: number): Promise<User> {
  //   return await this.userRepository.findOneBy({id});
  // }

  // createSignupOauthFromObject(id, user_id):  {

  // }

  async createSignupOauth(createSignupOauthDto: CreateSignupOauthDto): Promise<SignupOauth> {
    const { user, profileId } = createSignupOauthDto;
    const createdUser = this.signupOauthRepository.create({
      user,
      profileId,
    }); // 실제 entity와 column 값이 같아야 한다.

    return await this.signupOauthRepository.save(createdUser);
  }

  async createSignupMember(createSignupMemberDto: CreateSignupMemberDto): Promise<SignupMember> {
    const { id, password } = createSignupMemberDto;
    const createdUser = this.signupMemberRepository.create({
      id,
      password,
    });

    return await this.signupMemberRepository.save(createdUser);
  }

  async createUser(inputMail: string): Promise<User> {
    const mail = inputMail;
    const user = this.userRepository.create({
      nickname: randomUUID(),
      avatar: 'avatar', // 이미지가 저장된 url 의 id 값만 넣는다.
      mail, // 42 로 회원가입 할 때만 null 이 아니다.
    });

    return await this.userRepository.save(user);
  }
  // async createUser(createUserDto: CreateUserDto): Promise<User> {
  //   const { mail } = createUserDto;
  //   const user = this.userRepository.create({
  //     nickname: randomUUID(),
  //     avatar: 'avatar', // 이미지가 저장된 url 의 id 값만 넣는다.
  //     mail, // 42 로 회원가입 할 때만 null 이 아니다.
  //   });

  //   return await this.userRepository.save(user);
  // }
}
