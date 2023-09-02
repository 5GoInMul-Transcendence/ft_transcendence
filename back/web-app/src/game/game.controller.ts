import { Controller, Get, Session } from '@nestjs/common';
import { GameService } from './game.service';
import { Builder } from 'builder-pattern';
import { FindGameDto } from './dto/find-game.dto';

@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}

  @Get()
  findGameByUserId(@Session() session) {
    return this.gameService.findGameByUserId(
      Builder(FindGameDto).userId(session.userId).build(),
    );
  }
}
