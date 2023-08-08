import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { randomUUID } from 'crypto';
import { CreateSignupOauthDto } from './dto/create-signup-oauth.dto';
import { SignupOauth } from './signup-oauth.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(SignupOauth)
    private signupOauthRepository: Repository<SignupOauth>
  ) {}

  // async getUserById(id: number): Promise<User> {
  //   return await this.userRepository.findOneBy({id});
  // }

  // createSignupOauthFromObject(id, user_id):  {

  // }

  async createSignupOauth(createSignupOauthDto: CreateSignupOauthDto): Promise<SignupOauth> {
    const { id, user } = createSignupOauthDto;
    const createdUser = this.signupOauthRepository.create({
      id,
      user,
    });

    return await this.signupOauthRepository.save(createdUser);
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { mail } = createUserDto;
    const user = this.userRepository.create({
      nickname: randomUUID(),
      avatar: 'avatar', // 이미지가 저장된 url 의 id 값만 넣는다.
      mail, // 42 로 회원가입 할 때만 null 이 아니다.
    });

    return await this.userRepository.save(user);
  }
}
