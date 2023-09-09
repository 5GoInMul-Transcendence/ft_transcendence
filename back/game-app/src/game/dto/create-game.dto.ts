import { GameMode } from '../mode/enums/game-mode.enum';

export class CreateGameDto {
  readonly gameId: string;
  readonly gameMode: GameMode;
  readonly p1GameKey: string;
  readonly p2GameKey: string;
}
