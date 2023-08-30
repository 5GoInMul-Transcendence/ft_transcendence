import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateOauthUserDto } from './dto/create-oauth-user.dto';
import { OauthUser } from './entities/oauth-user.entity';
import { CreateMemberUserDto } from './dto/create-member-user.dto';
import { MemberUser } from './entities/member-user.entity';
import { FindUserDto } from '../memoryuser/dto/find-user.dto';
import { Builder } from 'builder-pattern';
import { UpdateUserDto } from './dto/update-user.dto';
import { MemoryUserService } from '../memoryuser/memory-user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Friend } from '../../friend/entities/friend.entity';
import { Follower } from '../../friend/entities/follower.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(OauthUser)
    private signupOauthRepository: Repository<OauthUser>,
    @InjectRepository(MemberUser)
    private signupMemberRepository: Repository<MemberUser>,
    @InjectRepository(Friend)
    private friendRepository: Repository<Friend>,
    @InjectRepository(Follower)
    private followerRepository: Repository<Follower>,
    private memoryUserService: MemoryUserService,
  ) {}

  async getOauthUserByProfileId(profileId: number): Promise<OauthUser> {
    return await this.signupOauthRepository.findOne({
      where: {
        profileId,
      },
      relations: {
        user: true, // 기본값은 false
      },
    });
  }

  async getMemberUserByAccountId(id: string): Promise<MemberUser> {
    return await this.signupMemberRepository.findOne({
      where: {
        id,
      },
      relations: {
        user: true,
      },
    });
  }

  async createSignupOauth(
    createOauthUserDto: CreateOauthUserDto,
  ): Promise<OauthUser> {
    const { user, profileId } = createOauthUserDto;
    const createdUser = this.signupOauthRepository.create({
      user,
      profileId,
    });

    return await this.signupOauthRepository.save(createdUser);
  }

  async createSignupMember(
    createMemberUserDto: CreateMemberUserDto,
  ): Promise<MemberUser> {
    const { user, id, password } = createMemberUserDto;
    const createdUser = this.signupMemberRepository.create({
      user,
      id,
      password,
    });

    return await this.signupMemberRepository.save(createdUser);
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { mail, nickname } = createUserDto;
    const user = this.userRepository.create({
      nickname,
      avatar: 'avatar', // 이미지가 저장된 url 의 id 값만 넣는다.
      mail,
    });

    const createdUser = await this.userRepository.save(user);
    await this.followerRepository.save({ userId: createdUser.id });
    await this.friendRepository.save({ userId: createdUser.id });

    return createdUser;
  }

  updateUser(dto: Partial<UpdateUserDto> & { userId: number }): void {
    const beforeUser = this.memoryUserService.findUserByUserId(
      Builder(FindUserDto).userId(dto.userId).build(),
    );

    this.memoryUserService.updateUser(dto);

    this.userRepository.update(dto.userId, { ...dto }).catch(() => {
      Object.keys(dto).forEach((key) => {
        dto[key] = beforeUser[key];
      });
      this.memoryUserService.updateUser(dto);
    });
  }
}
