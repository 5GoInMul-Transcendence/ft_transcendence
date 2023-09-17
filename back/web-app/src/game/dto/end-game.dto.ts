import { GameScore } from '../game-score';
import { PlayerNumber } from '../enums/player-number.enum';

export class EndGameDto {
  readonly gameId: string;
  readonly gameScore: GameScore;
  readonly winner: PlayerNumber;
}
