import { ICreateGameReturnDto } from '../grpc/interface/message.interface';

export class CreateGameReturnDto implements ICreateGameReturnDto{
  readonly gameId: string;
  readonly p1GameKey: string;
  readonly p2GameKey: string;
}
