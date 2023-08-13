import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { CreateOauthUserDto } from '../dto/create-oauth-user.dto';
import { OauthUser } from '../entities/oauth-user.entity';
import { CreateMemberUserDto } from '../dto/create-member-user.dto';
import { MemberUser } from '../entities/member-user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(OauthUser)
    private signupOauthRepository: Repository<OauthUser>,
    @InjectRepository(MemberUser)
    private signupMemberRepository: Repository<MemberUser>,
  ) {}

  async getOauthUserByProfileId(profileId: number): Promise<OauthUser> {
    return await this.signupOauthRepository.findOne({
      where: {
        profileId
      },
      relations: {
        user: true // 기본값은 false
      },
    });
  }

  async getMemberUserById(id: string): Promise<MemberUser> {
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

  async createSignupOauth(createOauthUserDto: CreateOauthUserDto): Promise<OauthUser> {
    const { user, profileId } = createOauthUserDto;
    const createdUser = this.signupOauthRepository.create({
      user,
      profileId,
    }); // 실제 entity와 column 값이 같아야 한다.

    return await this.signupOauthRepository.save(createdUser);
  }

  async createSignupMember(createMemberUserDto: CreateMemberUserDto): Promise<MemberUser> {
    const { id, password } = createMemberUserDto;
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
  //   const users = this.userRepository.create({
  //     nickname: randomUUID(),
  //     avatar: 'avatar', // 이미지가 저장된 url 의 id 값만 넣는다.
  //     mail, // 42 로 회원가입 할 때만 null 이 아니다.
  //   });

  //   return await this.userRepository.save(users);
  // }
}
