import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
import { CheckAvailableTwofactorDto } from './dto/check-available-twofactor.dto';
import { TwoFactorStatus } from '../enums/twoFactor-status.enum';
import { GetUserByNicknameDto } from './dto/get-user-by-nickname.dto';

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
      if (user.nickname === dto.nickname) {
        return user;
      }
    }

    throw new HttpException('존재하지 않은 유저입니다.', 200);
  }

  getNicknameByUserId(id: number): string {
    const nickname: string = this.memoryUsers.get(id).nickname;

    if (!nickname) {
      throw new HttpException('존재하지 않은 유저입니다.', HttpStatus.BAD_REQUEST);
    }
    return nickname;
  }

  getUserByNickname(dto: GetUserByNicknameDto): MemoryUser | undefined {
    for (const user of this.memoryUsers.values()) {
      if (user.nickname === dto.nickname) {
        return user;
      }
    }
    return undefined;
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

  checkAvailableTwoFactor(dto: CheckAvailableTwofactorDto) {
    const user = this.memoryUsers.get(dto.userId);

    if (dto.twoFactor === TwoFactorStatus.MAIL && user.mail === null) {
      throw new HttpException('잘못된 요청입니다.', HttpStatus.OK);
    }
    if (dto.twoFactor === TwoFactorStatus.PHONE && user.phone === null) {
      throw new HttpException('잘못된 요청입니다.', HttpStatus.OK);
    }

    return;
  }

  checkDuplicateNickname(dto: CheckDuplicateNicknameDto) {
    for (const user of this.memoryUsers.values()) {
      if (user.nickname === dto.nickname) {
        throw new HttpException('이미 사용중인 닉네임입니다.', 200);
      }
    }
  }
}
