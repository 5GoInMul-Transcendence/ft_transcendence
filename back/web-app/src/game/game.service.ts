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

@Injectable()
export class GameService {
  private gameGroups: Map<number, GameGroup>;

  constructor(
    @InjectIoClientProvider()
    private readonly gameServer: IoClient,
    private mainUserService: MainUserService,
    private memoryUserService: MemoryUserService,
  ) {
    this.gameGroups = new Map<number, GameGroup>();
  }

  @OnConnect()
  connect() {
    console.log('connected!');
  }

  @OnConnectError()
  connectError(err: Error) {
    console.log(err);
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

    this.gameGroups.set(dto.p1.id, gameGroup);
    this.gameGroups.set(dto.p2.id, gameGroup);
  }

  findGameByUserId(dto: FindGameDto) {
    const gameInfo = this.gameGroups.get(dto.userId);

    if (!gameInfo) {
      throw new HttpException('잘못된 요청입니다.', HttpStatus.OK);
    }

    const p1MemoryUser = this.memoryUserService.findUserByUserId(
      Builder(FindUserDto).userId(gameInfo.p1.id).build(),
    );
    const p2MemoryUser = this.memoryUserService.findUserByUserId(
      Builder(FindUserDto).userId(gameInfo.p2.id).build(),
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
        dto.userId == gameInfo.p1.id
          ? gameInfo.p1.gameKey
          : gameInfo.p2.gameKey,
      )
      .build();
  }
}
