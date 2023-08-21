import { HttpException, Injectable } from '@nestjs/common';
import { FindUserDto } from './dto/find-user.dto';
import { MemoryUserProvider } from './memory-user.provider';
import { MemoryUser } from './memory-user';
import { FindUserByNicknameDto } from './dto/find-user-by-nickname.dto';
import { UserStatus } from '../enums/user-status.enum';
import { UpdateMemoryUserDto } from './dto/update-memory-user.dto';
import { AddUserFollowerDto } from './dto/add-user-follower.dto';
import { DeleteUserFollowerDto } from './dto/delete-user-follower.dto';
import { AddUserFriendDto } from './dto/add-user-friend.dto';
import { DeleteUserFriendDto } from './dto/delete-user-friend.dto';
import { CheckDuplicateNicknameDto } from './dto/check-duplicate-nickname.dto';
import { UserDto } from '../user/dto/user.dto';
import { Builder } from 'builder-pattern';
import _ from 'lodash';
@Injectable()
export class MemoryUserService {
  constructor(private memoryUsers: MemoryUserProvider) {}

  findUserByUserId(dto: FindUserDto): MemoryUser {
    const user = this.memoryUsers.get(dto.userId);

    if (!user) {
      throw new HttpException('존재하지 않은 유저입니다.', 200);
    }

    return _.cloneDeep(user);
  }

  findUserByNickname(dto: FindUserByNicknameDto): MemoryUser {
    for (const user of this.memoryUsers.values()) {
      if (user.nickname == dto.nickname) {
        return user;
      }
    }

    throw new HttpException('존재하지 않은 유저입니다.', 200);
  }
  addUser(dto: UserDto) {
    const user = Builder(MemoryUser)
      .id(dto.userId)
      .nickname(dto.nickname)
      .avatar(dto.avatar)
      .mail(dto.mail)
      .phone(dto.phone)
      .twoFactor(dto.twoFactor)
      .status(UserStatus.OFFLINE)
      .friends(new Set<number>())
      .followers(new Set<number>())
      .blocks(new Set<number>())
      .build();
    this.memoryUsers.set(user.id, user);
  }

  updateUser(dto: Partial<UpdateMemoryUserDto> & { userId: number }) {
    const user = this.memoryUsers.get(dto.userId);

    if (user) {
      Object.keys(dto).forEach((key) => {
        user[key] = dto[key];
      });
    }
  }

  addUserFollower(dto: AddUserFollowerDto) {
    const user = this.memoryUsers.get(dto.userId);
    user.followers.add(dto.followerId);
  }

  deleteUserFollower(dto: DeleteUserFollowerDto) {
    const user = this.memoryUsers.get(dto.userId);
    user.followers.delete(dto.followerId);
  }

  addUserFriend(dto: AddUserFriendDto) {
    const user = this.memoryUsers.get(dto.userId);
    user.friends.add(dto.friendId);
  }

  deleteUserFriend(dto: DeleteUserFriendDto) {
    const user = this.memoryUsers.get(dto.userId);
    user.friends.delete(dto.friendId);
  }

  checkDuplicateNickname(dto: CheckDuplicateNicknameDto) {
    for (const user of this.memoryUsers.values()) {
      if (user.nickname == dto.nickname) {
        throw new HttpException('이미 사용중인 닉네임입니다.', 200);
      }
    }
  }
}
