import { AbstractGame } from '../mode/game.abstract';
import { GameUser } from '../gameuser/game-user';

export class EndGameDto {
  readonly endGame: AbstractGame;
  readonly gamePlayers: GameUser[];
}
