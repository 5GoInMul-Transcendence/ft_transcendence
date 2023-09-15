import { GameMode } from '../../../game/enums/game-mode.enum';

export class EnterMatchDto {
  userId: number;
  gameMode: GameMode;
}
