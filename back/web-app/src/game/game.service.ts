import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { EnterGameDto } from './dto/enter-game.dto';
import { ClientGrpc } from '@nestjs/microservices';
import { IGameServer } from './interface/game-server.interface';
import { FindGameDto } from './dto/find-game.dto';
import { GameInfo } from './game-Info';
import { Builder } from 'builder-pattern';
import { MemoryUserService } from '../users/memoryuser/memory-user.service';
import { FindUserDto } from '../users/memoryuser/dto/find-user.dto';
import { FindGameReturnDto } from './dto/find-game-return.dto';
import { GamePlayer } from './game-player';
import { firstValueFrom } from 'rxjs';
import { FindGameHistoryByUserIdDto } from './dto/find-game-history-by-userid.dto';
import { Repository } from 'typeorm';
import { User } from '../users/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AddGameHistoryDto } from './dto/add-game-history.dto';
import { GameHistory } from './entities/game-history.entity';

@Injectable()
export class GameService implements OnModuleInit {
  private gameServer: IGameServer;
  private gameInfos: Map<number, GameInfo>;

  constructor(
    @Inject('GAME_SERVER') private client: ClientGrpc,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(GameHistory)
    private gameHistoryRepository: Repository<GameHistory>,
    private memoryUserService: MemoryUserService,
  ) {
    this.gameInfos = new Map<number, GameInfo>();
  }

  onModuleInit(): any {
    this.gameServer = this.client.getService<IGameServer>('GameService');
  }

  async gameEnter(dto: EnterGameDto) {
    const game = await firstValueFrom(this.gameServer.createGame({}));

    const gameInfo = Builder(GameInfo)
      .p1(dto.p1)
      .p2(dto.p2)
      .gameKey(game.gameId)
      .build();

    this.gameInfos.set(dto.p1.id, gameInfo);
    this.gameInfos.set(dto.p2.id, gameInfo);
  }

  findGameByUserId(dto: FindGameDto) {
    const gameInfo = this.gameInfos.get(dto.userId);

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
      .gameKey(gameInfo.gameKey)
      .build();
  }

  async findGameHistoryByUserId(dto: FindGameHistoryByUserIdDto) {
    const user = await this.userRepository.findOne({
      where: {
        id: dto.userId,
      },
      relations: {
        gameHistories: true,
      },
    });

    return user.gameHistories == null ? [] : user.gameHistories;
  }

  async addGameHistory(dto: AddGameHistoryDto) {
    const { player1Id, player2Id, player1Score, player2Score } = dto;

    const gameHistory = this.gameHistoryRepository.create({
      player1Id,
      player2Id,
      player1Score,
      player2Score,
    });

    const player1User = await this.userRepository.findOneBy({ id: player1Id });
    const player2User = await this.userRepository.findOneBy({ id: player2Id });
    gameHistory.users = [player1User, player2User];

    this.gameHistoryRepository.save(gameHistory);
  }
}
