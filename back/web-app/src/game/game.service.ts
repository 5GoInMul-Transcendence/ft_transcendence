import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { EnterGameDto } from './dto/enter-game.dto';
import { ClientGrpc } from '@nestjs/microservices';
import { FindGameDto } from './dto/find-game.dto';
import { GameGroup } from './game-group';
import { Builder } from 'builder-pattern';
import { MemoryUserService } from '../users/memoryuser/memory-user.service';
import { FindUserDto } from '../users/memoryuser/dto/find-user.dto';
import { FindGameReturnDto } from './dto/find-game-return.dto';
import { GamePlayer } from './game-player';

@Injectable()
export class GameService implements OnModuleInit {
  private gameGroups: Map<number, GameGroup>;

  constructor(
    @Inject('GAME_SERVER') private client: ClientGrpc,
    private memoryUserService: MemoryUserService,
  ) {
    this.gameGroups = new Map<number, GameGroup>();
  }

  async gameEnter(dto: EnterGameDto) {
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
