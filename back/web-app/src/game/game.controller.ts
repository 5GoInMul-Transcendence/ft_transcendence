import { Controller, Get, Param, Session } from '@nestjs/common';
import { GameService } from './game.service';
import { Builder } from 'builder-pattern';
import { FindGameDto } from './dto/find-game.dto';
import { MemoryUserService } from '../users/memoryuser/memory-user.service';
import { FindUserByNicknameDto } from '../users/memoryuser/dto/find-user-by-nickname.dto';
import { FindGameHistoryByUserIdDto } from './dto/find-game-history-by-userid.dto';
import { FindGameHistoryResDto, GameHistoryPlayer } from './dto/find-game-history-res.dto';
import { FindUserDto } from '../users/memoryuser/dto/find-user.dto';
import { DateTime } from 'luxon';

@Controller('game')
export class GameController {
  constructor(
    private memoryUserService: MemoryUserService,
    private gameService: GameService,
  ) {}

  @Get()
  findGameByUserId(@Session() session) {
    return this.gameService.findGameByUserId(
      Builder(FindGameDto).userId(session.userId).build(),
    );
  }

  @Get('history/:nickname')
  async findGameHistory(@Param('nickname') nickname) {
    const user = this.memoryUserService.findUserByNickname(
      Builder(FindUserByNicknameDto).nickname(nickname).build(),
    );
    const gameHistories = await this.gameService.findGameHistoryByUserId(
      Builder(FindGameHistoryByUserIdDto).userId(user.id).build(),
    );

    const findGameHistoryResDto = [];
    for (const gameHistory of gameHistories) {
      const player1 = this.memoryUserService.findUserByUserId(
        Builder(FindUserDto).userId(gameHistory.player1Id).build(),
      );
      const player2 = this.memoryUserService.findUserByUserId(
        Builder(FindUserDto).userId(gameHistory.player2Id).build(),
      );

      const resDto = Builder(FindGameHistoryResDto)
        .gameId(gameHistory.id)
        .createdDate(
          DateTime.fromJSDate(gameHistory.createdDate).toFormat(
            'yyyy-MM-dd HH:mm',
          ),
        )
        .player1(
          Builder(GameHistoryPlayer)
            .id(player1.id)
            .nickname(player1.nickname)
            .avatar(player1.avatar)
            .score(gameHistory.player1Score)
            .build(),
        )
        .player2(
          Builder(GameHistoryPlayer)
            .id(player2.id)
            .nickname(player2.nickname)
            .avatar(player2.avatar)
            .score(gameHistory.player2Score)
            .build(),
        )
        .build();
      findGameHistoryResDto.push(resDto);
    }

    return findGameHistoryResDto;
  }
}
