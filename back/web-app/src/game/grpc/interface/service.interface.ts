import { Observable } from 'rxjs';
import { ICreateGameReturnDto, ICreateGameDto } from './message.interface';

export interface IGameServerService {
  createGame(dto: ICreateGameDto): Observable<ICreateGameReturnDto>;
}
