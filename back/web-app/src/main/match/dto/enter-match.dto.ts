import { GameType } from '../../../game/enums/game-type.enum';

export class EnterMatchDto {
  userId: number;
  gameType: GameType;
}
