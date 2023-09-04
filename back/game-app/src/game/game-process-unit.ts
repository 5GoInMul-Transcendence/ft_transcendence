import { GameUser } from './gameuser/game-user';
import { AbstractGame } from './mode/game.abstract';

export class GameProcessUnit {
  game: AbstractGame;
  gamePlayers: GameUser[];
}
