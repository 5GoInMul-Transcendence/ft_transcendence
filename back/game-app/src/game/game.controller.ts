import { Controller } from '@nestjs/common';
import { GameService } from './game.service';

@Controller()
export class GameController {
  constructor(private gameService: GameService) {}
  
}
