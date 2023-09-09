import { GameScore } from '../mode/object/game-object';
import { PlayerNumber } from '../player/enums/player-number.enum';

export class EndGameDto {
  readonly gameId: string;
  readonly gameScore: GameScore;
  readonly winner: PlayerNumber;
}
