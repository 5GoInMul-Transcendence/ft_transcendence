import { GameMode } from '../enums/game-mode.enum';
import { ICreateGameDto } from '../grpc/interface/message.interface';

export class CreateGameDto implements ICreateGameDto {
  readonly gameMode: GameMode;
}
