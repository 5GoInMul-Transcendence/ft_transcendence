import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EnterGameDto } from './dto/enter-game.dto';
import { FindGameDto } from './dto/find-game.dto';
import { GameGroup } from './game-group';
import { Builder } from 'builder-pattern';
import { MemoryUserService } from '../users/memoryuser/memory-user.service';
import { FindUserDto } from '../users/memoryuser/dto/find-user.dto';
import { FindGameReturnDto } from './dto/find-game-return.dto';
import { GamePlayer } from './game-player';
import {
  EventListener,
  InjectIoClientProvider,
  IoClient,
  OnConnect,
  OnConnectError,
} from 'nestjs-io-client';
import { v4 as uuid } from 'uuid';
import { MainUserService } from '../main/mainuser/main-user.service';
import { CreateGameDto } from './dto/create-game.dto';
import { EndGameDto } from './dto/end-game.dto';
import { LadderService } from '../ladder/ladder.service';
import { AchievementService } from '../achievement/achievement.service';
import { FriendService } from '../friend/friend.service';
import { PlayerNumber } from './enums/player-number.enum';
import { UpdateLadderDto } from '../ladder/dto/update-ladder.dto';
import { UpdateAchievementDto } from '../achievement/dto/update-achievement.dto';
import { AchievementType } from '../achievement/enums/achievement-type.enum';
import { UpdateMemoryUserDto } from '../users/memoryuser/dto/update-memory-user.dto';
import { UserStatus } from '../users/enums/user-status.enum';
import { UpdateMainUserDto } from '../main/dto/update-main-user.dto';
import { MainUserStatus } from '../main/enums/main-user-status.enum';
import { BroadcastFriendUpdateDto } from '../friend/dto/broadcast-friend-update.dto';
import { FriendInfo } from '../friend/friend-info';

@Injectable()
export class GameService {
  private gameGroups: Map<string, GameGroup>;

  constructor(
    @InjectIoClientProvider()
    private readonly gameServer: IoClient,
    private mainUserService: MainUserService,
    private memoryUserService: MemoryUserService,
    private ladderService: LadderService,
    private achievementService: AchievementService,
    private friendsService: FriendService,
  ) {
    this.gameGroups = new Map<string, GameGroup>();
  }
  
  // @OnConnectError()
  // connectError(err: Error) {
  //   console.log(err);
  // }

  @EventListener('endGame')
  endGame(dto: EndGameDto) {
    const { p1, p2 } = this.gameGroups.get(dto.gameId);

    const winnerId = dto.winner == PlayerNumber.P1 ? p1.id : p2.id;
    const loserId = dto.winner == PlayerNumber.P1 ? p2.id : p1.id;

    /* Update ladder */
    this.ladderService.updateLadder(
      Builder(UpdateLadderDto).userId(winnerId).isWin(true).build(),
    );
    this.ladderService.updateLadder(
      Builder(UpdateLadderDto).userId(loserId).isWin(false).build(),
    );

    /* Update achievement */
    this.achievementService.updateAchievement(
      Builder(UpdateAchievementDto)
        .userId(winnerId)
        .achievementType(AchievementType.GAME_WIN)
        .build(),
    );

    /* Update GameRecord*/

    /* Update MemoryUserStatus */
    this.memoryUserService.updateUser(
      Builder(UpdateMemoryUserDto)
        .userId(winnerId)
        .status(UserStatus.ONLINE)
        .build(),
    );
    this.memoryUserService.updateUser(
      Builder(UpdateMemoryUserDto)
        .userId(loserId)
        .status(UserStatus.ONLINE)
        .build(),
    );

    /* Update MainUserStatus */
    this.mainUserService.updateUser(
      Builder(UpdateMainUserDto)
        .userId(winnerId)
        .status(MainUserStatus.DEFAULT)
        .build(),
    );
    this.mainUserService.updateUser(
      Builder(UpdateMainUserDto)
        .userId(loserId)
        .status(MainUserStatus.DEFAULT)
        .build(),
    );

    /* BroadCast UserStatus */
    this.friendsService.broadcastFriendUpdate(
      Builder(BroadcastFriendUpdateDto)
        .userId(winnerId)
        .friendInfo(
          Builder(FriendInfo).id(winnerId).status(UserStatus.ONLINE).build(),
        )
        .build(),
    );
    this.friendsService.broadcastFriendUpdate(
      Builder(BroadcastFriendUpdateDto)
        .userId(loserId)
        .friendInfo(
          Builder(FriendInfo).id(loserId).status(UserStatus.ONLINE).build(),
        )
        .build(),
    );
    this.gameGroups.delete(dto.gameId);
    this.gameGroups.delete(winnerId.toString());
    this.gameGroups.delete(loserId.toString());
  }

  async gameEnter(dto: EnterGameDto) {
    const gameId = uuid();
    const p1GameKey = uuid();
    const p2GameKey = uuid();

    this.gameServer.emit(
      'createGame',
      Builder(CreateGameDto)
        .gameId(gameId)
        .gameMode(dto.gameMode)
        .p1GameKey(p1GameKey)
        .p2GameKey(p2GameKey)
        .build(),
    );

    const gameGroup = Builder(GameGroup)
      .gameId(gameId)
      .p1({ id: dto.p1.id, gameKey: p1GameKey })
      .p2({ id: dto.p2.id, gameKey: p2GameKey })
      .build();

    this.gameGroups.set(gameId, gameGroup);
    this.gameGroups.set(dto.p1.id.toString(), gameGroup);
    this.gameGroups.set(dto.p2.id.toString(), gameGroup);
  }

  findGameByUserId(dto: FindGameDto) {
    const gameGroup = this.gameGroups.get(dto.userId.toString());

    if (!gameGroup) {
      throw new HttpException('잘못된 요청입니다.', HttpStatus.OK);
    }

    const p1MemoryUser = this.memoryUserService.findUserByUserId(
      Builder(FindUserDto).userId(gameGroup.p1.id).build(),
    );
    const p2MemoryUser = this.memoryUserService.findUserByUserId(
      Builder(FindUserDto).userId(gameGroup.p2.id).build(),
    );

    return Builder(FindGameReturnDto)
      .p1(
        Builder(GamePlayer)
          .id(p1MemoryUser.id)
          .nickname(p1MemoryUser.nickname)
          .avatar(p1MemoryUser.avatar)
          .build(),
      )
      .p2(
        Builder(GamePlayer)
          .id(p2MemoryUser.id)
          .nickname(p2MemoryUser.nickname)
          .avatar(p2MemoryUser.avatar)
          .build(),
      )
      .gameKey(
        dto.userId == gameGroup.p1.id
          ? gameGroup.p1.gameKey
          : gameGroup.p2.gameKey,
      )
      .build();
  }
}
