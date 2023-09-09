import { AbstractGame } from './mode/game.abstract';
import { Player } from './player/enums/player';

export class GameGroup {
  game: AbstractGame;
  player: Player;
  rivalPlayer: Player;
}
