import { PlayerNumber } from './enums/player-number.enum';
import { AbstractGame } from './mode/game.abstract';

export class GameGroup {
  game: AbstractGame;
  playerNumber: PlayerNumber;
  rivalGameKey: string;
}
