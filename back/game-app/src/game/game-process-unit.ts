import { GameUser } from './gameuser/game-user';
import { AbstractGame } from './mode/game.abstract';
import { GameActionStatus } from './enums/gam-action-status.enum';

export class GameProcessUnit {
  game: AbstractGame;
  gamePlayers: GameUser[];
  gameStatus: GameActionStatus;
}
