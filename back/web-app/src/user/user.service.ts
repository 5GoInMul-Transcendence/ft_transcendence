import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user';
import { randomUUID } from 'crypto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  // async getUserById(id: number): Promise<User> {
  //   return await this.userRepository.findOneBy({id});
  // }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { mail } = createUserDto;
    const user = this.userRepository.create({
      nickname: randomUUID(),
      avatar: 'avatar', // 이미지가 저장된 url 의 id 값만 넣는다.
      mail, // 42 로 회원가입 할 때만 null 이 아니다.
    });

    await this.userRepository.save(user);
    return user;
  }

  printHello() {
    console.log('Hello');
  }
}
