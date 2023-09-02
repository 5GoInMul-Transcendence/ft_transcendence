import { HttpException, Injectable } from '@nestjs/common';
import { MemoryUserService } from '../users/memoryuser/memory-user.service';
import { DataSource } from 'typeorm';
import { AddFriendDto } from './dto/add-friend.dto';
import { AddFriendResDto } from './dto/add-friend-res.dto';
import { Builder } from 'builder-pattern';
import { FindUserDto } from '../users/memoryuser/dto/find-user.dto';
import { FindUserByNicknameDto } from '../users/memoryuser/dto/find-user-by-nickname.dto';
import { MemoryUser } from '../users/memoryuser/memory-user';
import { AddUserFriendDto } from '../users/memoryuser/dto/add-user-friend.dto';
import { AddUserFollowerDto } from '../users/memoryuser/dto/add-user-follower.dto';
import { Friend } from './entities/friend.entity';
import { Follower } from './entities/follower.entity';
import { DeleteUserFriendDto } from '../users/memoryuser/dto/delete-user-friend.dto';
import { DeleteUserFollowerDto } from '../users/memoryuser/dto/delete-user-follower.dto';
import { GetFriendsInfoDto } from './dto/get-friends-info.dto';
import { FriendInfo } from './friend-info';
import { MainUserService } from '../main/mainuser/main-user.service';
import { BroadcastFriendUpdateDto } from './dto/broadcast-friend-update.dto';
import { BroadcastMessageDto } from '../main/dto/broadcast-message.dto';

@Injectable()
export class FriendService {
  constructor(
    private mainUserService: MainUserService,
    private memoryUserService: MemoryUserService,
    private dataSource: DataSource,
  ) {}

  getFriendsInfo(dto: GetFriendsInfoDto) {
    const user = this.memoryUserService.findUserByUserId(
      Builder(FindUserDto).userId(dto.userId).build(),
    );

    const friendsInfo: FriendInfo[] = [];

    for (const friendId of user.friends.values()) {
      const friend = this.memoryUserService.findUserByUserId(
        Builder(FindUserDto).userId(friendId).build(),
      );

      friendsInfo.push(
        Builder(FriendInfo)
          .id(friend.id)
          .nickname(friend.nickname)
          .avatar(friend.avatar)
          .status(friend.status)
          .build(),
      );
    }

    return friendsInfo;
  }

  async addFriend(dto: AddFriendDto): Promise<AddFriendResDto> {
    const user = this.memoryUserService.findUserByUserId(
      Builder(FindUserDto).userId(dto.userId).build(),
    );
    const friend = this.memoryUserService.findUserByNickname(
      Builder(FindUserByNicknameDto).nickname(dto.nickname).build(),
    );

    if (user.id == friend.id) {
      throw new HttpException('자신을 친구로 추가할 수 없습니다.', 200);
    }

    const userFriends = user.friends;
    const friendFollowers = friend.followers;

    if (user.friends.has(friend.id)) {
      throw new HttpException('이미 등록된 친구입니다.', 200);
    }

    userFriends.add(friend.id);
    friendFollowers.add(user.id);

    this.saveAddFriend(user, userFriends, friend, friendFollowers);

    return Builder(AddFriendResDto)
      .id(friend.id)
      .nickname(friend.nickname)
      .avatar(friend.avatar)
      .status(friend.status)
      .build();
  }

  broadcastFriendUpdate(dto: BroadcastFriendUpdateDto) {
    const user = this.memoryUserService.findUserByUserId(
      Builder(FindUserDto).userId(dto.userId).build(),
    );

    this.mainUserService.broadcastMessage(
      Builder(BroadcastMessageDto)
        .target(user.followers.values())
        .event('friend_update')
        .data(dto.friendInfo)
        .build(),
    );
  }

  private async saveAddFriend(
    user: MemoryUser,
    userFriends: Set<number>,
    friend: MemoryUser,
    friendFollowers: Set<number>,
  ) {
    this.memoryUserService.addUserFriend(
      Builder(AddUserFriendDto).userId(user.id).friendId(friend.id).build(),
    );
    this.memoryUserService.addUserFollower(
      Builder(AddUserFollowerDto).userId(friend.id).followerId(user.id).build(),
    );

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      queryRunner.manager.update(
        Friend,
        { userId: user.id },
        { friends: Array.from(userFriends) },
      );
      queryRunner.manager.update(
        Follower,
        { userId: friend.id },
        { followers: Array.from(friendFollowers) },
      );
      await queryRunner.commitTransaction();
    } catch (err) {
      this.memoryUserService.deleteUserFriend(
        Builder(DeleteUserFriendDto)
          .userId(user.id)
          .friendId(friend.id)
          .build(),
      );
      this.memoryUserService.deleteUserFollower(
        Builder(DeleteUserFollowerDto)
          .userId(friend.id)
          .followerId(user.id)
          .build(),
      );
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
