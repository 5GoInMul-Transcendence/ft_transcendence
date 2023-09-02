import { Queue } from '@datastructures-js/queue';
import { GameType } from '../../game/enums/game-type.enum';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MatchQueue {
  private matchQueues: Map<GameType, Queue<number>>;
  private userGameTypes: Map<number, GameType>;

  constructor() {
    this.matchQueues = new Map<GameType, Queue<number>>();
    this.userGameTypes = new Map<number, GameType>();

    for (const gameType of Object.values(GameType)) {
      this.matchQueues.set(gameType, new Queue<number>());
    }
  }

  push(gameType: GameType, userId: number) {
    this.matchQueues.get(gameType).push(userId);

    this.userGameTypes.set(userId, gameType);
  }

  popByUserId(userId: number) {
    const gameType = this.userGameTypes.get(userId);

    this.userGameTypes.delete(userId);

    return this.matchQueues.get(gameType).pop();
  }

  popByGameType(gameType: GameType) {
    const userId = this.matchQueues.get(gameType).pop();

    this.userGameTypes.delete(userId);

    return userId;
  }

  isEmpty(gameType: GameType) {
    return this.matchQueues.get(gameType).isEmpty();
  }
}
