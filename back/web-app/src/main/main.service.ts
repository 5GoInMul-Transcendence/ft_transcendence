import { Injectable } from '@nestjs/common';
import { MemoryUserService } from '../users/memoryuser/memory-user.service';
import { ConnectionDto } from './dto/connection.dto';
import { FindUserDto } from '../users/memoryuser/dto/find-user.dto';
import { Builder } from 'builder-pattern';
import { UpdateMemoryUserDto } from '../users/memoryuser/dto/update-memory-user.dto';
import { UserStatus } from '../users/enums/user-status.enum';
import { UpdateFriendResDto } from '../friend/dto/update-friend-res.dto';
import { DisconnectionDto } from './dto/disconnection.dto';
import { MainUserService } from './main-user.service';
import { AddMainUserDto } from './dto/add-main-user.dto';
import { BroadcastMessageDto } from './dto/broadcast-message.dto';
import { DeleteMainUserDto } from './dto/delete-main-user.dto';
import { WsException } from '@nestjs/websockets';
import { CheckReconnectionDto } from './dto/check-reconnection.dto';
import { CheckDisconnectionByReconnectionDto } from './dto/check-disconnection-by-reconnection.dto';
import { CheckSessionDto } from './dto/check-session.dto';
import { UpdateMainUserDto } from './dto/update-main-user.dto';

@Injectable()
export class MainService {
  private reconnection = Symbol('reconnection');

  constructor(
    private mainUserService: MainUserService,
    private memoryUserService: MemoryUserService,
  ) {}

  checkSession(dto: CheckSessionDto) {
    if (!dto.session?.userId) {
      dto.client.disconnect();
      throw new WsException('');
    }
  }

  checkReconnection(dto: CheckReconnectionDto) {
    const prevUser = this.mainUserService.findUserByUserId(
      Builder(FindUserDto).userId(dto.userId).build(),
    );

    if (prevUser) {
      prevUser.client[this.reconnection] = true;
      prevUser.client.disconnect();
      this.mainUserService.updateUser(
        Builder(UpdateMainUserDto)
          .userId(dto.userId)
          .client(dto.client)
          .build(),
      );

      throw new WsException('');
    }
  }

  checkDisconnectionByReconnection(dto: CheckDisconnectionByReconnectionDto) {
    if (dto.client[this.reconnection]) {
      throw new WsException('');
    }
  }

  connection(dto: ConnectionDto) {
    const user = this.memoryUserService.findUserByUserId(
      Builder(FindUserDto).userId(dto.userId).build(),
    );

    // 유저의 상태를 online으로 변경한다.
    this.memoryUserService.updateUser(
      Builder(UpdateMemoryUserDto)
        .userId(dto.userId)
        .status(UserStatus.ONLINE)
        .build(),
    );

    // 유저의 follower들에게 상태변경을 알린다.
    const updateFriendResDto = Builder(UpdateFriendResDto)
      .id(user.id)
      .status(UserStatus.ONLINE)
      .build();

    this.mainUserService.broadcastMessage(
      Builder(BroadcastMessageDto)
        .target(user.followers.values())
        .event('friend_update')
        .data(updateFriendResDto)
        .build(),
    );

    // 메인 유저 저장
    this.mainUserService.addUser(
      Builder(AddMainUserDto).userId(dto.userId).client(dto.client).build(),
    );
  }

  disConnection(dto: DisconnectionDto) {
    const user = this.memoryUserService.findUserByUserId(
      Builder(FindUserDto).userId(dto.userId).build(),
    );

    // 유저 상태를 offline으로 변경한다.
    this.memoryUserService.updateUser(
      Builder(UpdateMemoryUserDto)
        .userId(dto.userId)
        .status(UserStatus.OFFLINE)
        .build(),
    );

    // 유저 상태를 follower들한테 알린다.
    const updateFriendResDto = Builder(UpdateFriendResDto)
      .id(user.id)
      .status(UserStatus.OFFLINE)
      .build();

    this.mainUserService.broadcastMessage(
      Builder(BroadcastMessageDto)
        .target(user.followers.values())
        .event('friend_update')
        .data(updateFriendResDto)
        .build(),
    );

    // 메인 유저 삭제
    this.mainUserService.deleteUser(
      Builder(DeleteMainUserDto).userId(dto.userId).build(),
    );
  }
}
