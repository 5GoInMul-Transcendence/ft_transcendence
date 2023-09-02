import { GameType } from '../enums/game-type.enum';

export class EnterGameDto {
  p1: { id };
  p2: { id };
  gameType: GameType;
}
