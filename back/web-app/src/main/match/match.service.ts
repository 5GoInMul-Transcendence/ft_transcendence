import { Injectable } from '@nestjs/common';
import { MainUserService } from '../mainuser/main-user.service';
import { EnterMatchDto } from './dto/enter-match.dto';
import { Builder } from 'builder-pattern';
import { UpdateMainUserDto } from '../dto/update-main-user.dto';
import { MainUserStatus } from '../enums/main-user-status.enum';
import { SendMessageDto } from '../dto/send-message.dto';
import { FindUserDto } from '../../users/memoryuser/dto/find-user.dto';
import { LeaveMatchDto } from './dto/leave-match.dto';
import { AcceptMatchDto } from './dto/accept-match.dto';
import { GameService } from '../../game/game.service';
import { EnterGameDto } from '../../game/dto/enter-game.dto';
import { DisconnectMatchDto } from './dto/disconnect-match.dto';
import { UpdateMemoryUserDto } from '../../users/memoryuser/dto/update-memory-user.dto';
import { UserStatus } from '../../users/enums/user-status.enum';
import { MemoryUserService } from '../../users/memoryuser/memory-user.service';
import { MatchQueue } from './match-queue';
import { MatchGroup } from './match-group';
import { FriendService } from '../../friend/friend.service';
import { BroadcastFriendUpdateDto } from '../../friend/dto/broadcast-friend-update.dto';
import { FriendInfo } from '../../friend/friend-info';
import { InviteMatchDto } from './dto/invite-match.dto';
import { GameMode } from '../../game/enums/game-mode.enum';

@Injectable()
export class MatchService {
  private matchGroup: Map<number, MatchGroup>;

  constructor(
    private mainUserService: MainUserService,
    private memoryUserService: MemoryUserService,
    private friendService: FriendService,
    private gameService: GameService,
    private matchQueue: MatchQueue,
  ) {
    this.matchGroup = new Map<number, MatchGroup>();
  }

  enterMatch(dto: EnterMatchDto) {
    const user = this.mainUserService.findUserByUserId(
      Builder(FindUserDto).userId(dto.userId).build(),
    );

    if (user.status !== MainUserStatus.DEFAULT) {
      return;
    }

    // 큐 상태 확인
    const isEmptyQueue = this.matchQueue.isEmpty(dto.gameMode);

    // 큐가 비어있다면
    if (isEmptyQueue) {
      this.matchQueue.push(dto.gameMode, dto.userId);
      this.mainUserService.updateUser(
        Builder(UpdateMainUserDto)
          .userId(dto.userId)
          .status(MainUserStatus.MATCH_WAIT_QUEUE)
          .build(),
      );
    }

    // 큐가 비어있지 않다면
    if (isEmptyQueue === false) {
      // 큐 요소에서 대기유저 가져오기
      const rivalUserId = this.matchQueue.popByGameMode(dto.gameMode);

      // 유저 그룹스에 추가
      this.matchGroup.set(
        rivalUserId,
        Builder(MatchGroup)
          .rivalUserId(dto.userId)
          .gameMode(dto.gameMode)
          .build(),
      );
      this.matchGroup.set(
        dto.userId,
        Builder(MatchGroup)
          .rivalUserId(rivalUserId)
          .gameMode(dto.gameMode)
          .build(),
      );

      // 유저 상태 변경하기
      this.mainUserService.updateUser(
        Builder(UpdateMainUserDto)
          .userId(dto.userId)
          .status(MainUserStatus.MATCH_WAIT_ACCEPT)
          .build(),
      );
      this.mainUserService.updateUser(
        Builder(UpdateMainUserDto)
          .userId(rivalUserId)
          .status(MainUserStatus.MATCH_WAIT_ACCEPT)
          .build(),
      );

      // 유저에게 수락응답요청 보내기
      this.mainUserService.sendMessage(
        Builder(SendMessageDto)
          .userId(dto.userId)
          .event('waitMatch')
          .data('')
          .build(),
      );
      this.mainUserService.sendMessage(
        Builder(SendMessageDto)
          .userId(rivalUserId)
          .event('waitMatch')
          .data('')
          .build(),
      );
    }
  }

  leaveMatch(dto: LeaveMatchDto) {
    // 유저 상태 확인
    const user = this.mainUserService.findUserByUserId(
      Builder(FindUserDto).userId(dto.userId).build(),
    );

    if (user.status !== MainUserStatus.MATCH_WAIT_QUEUE) {
      return;
    }

    // 유저 큐에서 삭제
    this.matchQueue.popByUserId(dto.userId);

    // 유저 상태 업데이트
    this.mainUserService.updateUser(
      Builder(UpdateMainUserDto)
        .userId(dto.userId)
        .status(MainUserStatus.DEFAULT)
        .build(),
    );
  }

  acceptMatch(dto: AcceptMatchDto) {
    const user = this.mainUserService.findUserByUserId(
      Builder(FindUserDto).userId(dto.userId).build(),
    );

    if (user.status !== MainUserStatus.MATCH_WAIT_ACCEPT) {
      return;
    }

    const { rivalUserId, gameMode, isInviteMatch } = this.matchGroup.get(
      dto.userId,
    );

    const rivalUser = this.mainUserService.findUserByUserId(
      Builder(FindUserDto).userId(rivalUserId).build(),
    );

    // 유저 매치 거부
    if (dto.accepted == false) {
      this.matchGroup.delete(dto.userId);
      this.matchGroup.delete(rivalUserId);

      this.mainUserService.updateUser(
        Builder(UpdateMainUserDto)
          .userId(dto.userId)
          .status(MainUserStatus.DEFAULT)
          .build(),
      );
      this.mainUserService.updateUser(
        Builder(UpdateMainUserDto)
          .userId(rivalUserId)
          .status(MainUserStatus.DEFAULT)
          .build(),
      );
      if (isInviteMatch) {
        this.mainUserService.sendMessage(
          Builder(SendMessageDto)
            .userId(rivalUserId)
            .event('successMatch')
            .data({ status: false, isInvite: true })
            .build(),
        );
      } else {
        this.mainUserService.sendMessage(
          Builder(SendMessageDto)
            .userId(rivalUserId)
            .event('successMatch')
            .data({ status: false, isInvite: false })
            .build(),
        );
        this.enterMatch(
          Builder(EnterMatchDto).userId(rivalUserId).gameMode(gameMode).build(),
        );
      }
    }

    // 유저 매치 수락 + 상대방 매치 수락 대기
    if (dto.accepted && rivalUser.status === MainUserStatus.MATCH_WAIT_ACCEPT) {
      this.mainUserService.updateUser(
        Builder(UpdateMainUserDto)
          .userId(dto.userId)
          .status(MainUserStatus.MATCH_ACCEPT)
          .build(),
      );
      return;
    }

    // 유저 매치 수락 + 상대방 매치 수락
    if (dto.accepted && rivalUser.status === MainUserStatus.MATCH_ACCEPT) {
      const p1 = { id: rivalUserId };
      const p2 = { id: dto.userId };

      this.matchGroup.delete(p1.id);
      this.matchGroup.delete(p2.id);

      this.mainUserService.updateUser(
        Builder(UpdateMainUserDto)
          .userId(p1.id)
          .status(MainUserStatus.INGMAE)
          .build(),
      );
      this.mainUserService.updateUser(
        Builder(UpdateMainUserDto)
          .userId(p2.id)
          .status(MainUserStatus.INGMAE)
          .build(),
      );
      this.memoryUserService.updateUser(
        Builder(UpdateMemoryUserDto)
          .userId(p1.id)
          .status(UserStatus.INGAME)
          .build(),
      );
      this.memoryUserService.updateUser(
        Builder(UpdateMemoryUserDto)
          .userId(p2.id)
          .status(UserStatus.INGAME)
          .build(),
      );

      this.gameService.gameEnter(
        Builder(EnterGameDto).p1(p1).p2(p2).gameMode(gameMode).build(),
      );

      // 게임 승락 알리기
      this.mainUserService.sendMessage(
        Builder(SendMessageDto)
          .userId(p1.id)
          .event('successMatch')
          .data({ status: true })
          .build(),
      );
      this.mainUserService.sendMessage(
        Builder(SendMessageDto)
          .userId(p2.id)
          .event('successMatch')
          .data({ status: true })
          .build(),
      );

      // 유저 상태(INGAME) 변경 알리기
      this.friendService.broadcastFriendUpdate(
        Builder(BroadcastFriendUpdateDto)
          .userId(p1.id)
          .friendInfo(
            Builder(FriendInfo).id(p1.id).status(UserStatus.INGAME).build(),
          )
          .build(),
      );
      this.friendService.broadcastFriendUpdate(
        Builder(BroadcastFriendUpdateDto)
          .userId(p2.id)
          .friendInfo(
            Builder(FriendInfo).id(p2.id).status(UserStatus.INGAME).build(),
          )
          .build(),
      );
    }
  }

  inviteMatch(dto: InviteMatchDto) {
    const { userId, inviteUserId } = dto;

    const user = this.mainUserService.findUserByUserId(
      Builder(FindUserDto).userId(userId).build(),
    );
    const inviteUser = this.mainUserService.findUserByUserId(
      Builder(FindUserDto).userId(inviteUserId).build(),
    );

    /* 매치큐, 게임중이 아닐 경우만 초대를 받는다. */
    if (
      userId == inviteUserId ||
      user?.status !== MainUserStatus.DEFAULT ||
      inviteUser?.status !== MainUserStatus.DEFAULT
    ) {
      return;
    }

    this.matchGroup.set(
      inviteUserId,
      Builder(MatchGroup)
        .rivalUserId(userId)
        .gameMode(GameMode.GOLDENPONG)
        .isInviteMatch(true)
        .build(),
    );
    this.matchGroup.set(
      dto.userId,
      Builder(MatchGroup)
        .rivalUserId(inviteUserId)
        .gameMode(GameMode.GOLDENPONG)
        .isInviteMatch(true)
        .build(),
    );

    // 유저 상태 변경하기
    this.mainUserService.updateUser(
      Builder(UpdateMainUserDto)
        .userId(userId)
        .status(MainUserStatus.MATCH_WAIT_ACCEPT)
        .build(),
    );
    this.mainUserService.updateUser(
      Builder(UpdateMainUserDto)
        .userId(inviteUserId)
        .status(MainUserStatus.MATCH_WAIT_ACCEPT)
        .build(),
    );

    // 유저에게 수락응답요청 보내기
    this.mainUserService.sendMessage(
      Builder(SendMessageDto)
        .userId(userId)
        .event('waitMatch')
        .data('')
        .build(),
    );
    this.mainUserService.sendMessage(
      Builder(SendMessageDto)
        .userId(inviteUserId)
        .event('waitMatch')
        .data('')
        .build(),
    );
  }

  disconnectMatch(dto: DisconnectMatchDto) {
    const user = this.mainUserService.findUserByUserId(
      Builder(FindUserDto).userId(dto.userId).build(),
    );

    switch (user.status) {
      case MainUserStatus.MATCH_WAIT_QUEUE:
        this.matchQueue.popByUserId(dto.userId);
        break;
      case MainUserStatus.MATCH_WAIT_ACCEPT:
      case MainUserStatus.MATCH_ACCEPT:
        this.acceptMatch(
          Builder(AcceptMatchDto).userId(dto.userId).accepted(false).build(),
        );
        break;
      case MainUserStatus.INGMAE:
        // gameService에 기브업 요청 보내기!
        break;
    }
  }
}
