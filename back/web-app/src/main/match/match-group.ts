import { GameMode } from '../../game/enums/game-mode.enum';

export class MatchGroup {
  rivalUserId: number;
  gameMode: GameMode;
  isInviteMatch: boolean;
}
