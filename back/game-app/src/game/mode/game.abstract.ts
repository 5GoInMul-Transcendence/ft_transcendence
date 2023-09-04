import { v4 as uuid } from 'uuid';

export abstract class AbstractGame {
  gameId = uuid();
}
