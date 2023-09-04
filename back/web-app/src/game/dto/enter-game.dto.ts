import { GameMode } from '../enums/game-mode.enum';

export class EnterGameDto {
  p1: { id };
  p2: { id };
  gameMode: GameMode;
}
