import { Observable } from 'rxjs';

export interface IGameServer {
  createGame(data: {}): Observable<IGame>;
}

export interface IGame {
  gameId: string;
  p1GameKey: string;
  p2GameKey: string;
}
