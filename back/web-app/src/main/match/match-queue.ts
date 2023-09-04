import { Queue } from '@datastructures-js/queue';
import { GameMode } from '../../game/enums/game-mode.enum';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MatchQueue {
  private matchQueues: Map<GameMode, Queue<number>>;
  private userGameTypes: Map<number, GameMode>;

  constructor() {
    this.matchQueues = new Map<GameMode, Queue<number>>();
    this.userGameTypes = new Map<number, GameMode>();

    for (const gameMode of Object.values(GameMode)) {
      this.matchQueues.set(gameMode, new Queue<number>());
    }
  }

  push(gameMode: GameMode, userId: number) {
    this.matchQueues.get(gameMode).push(userId);

    this.userGameTypes.set(userId, gameMode);
  }

  popByUserId(userId: number) {
    const gameMode = this.userGameTypes.get(userId);

    this.userGameTypes.delete(userId);

    return this.matchQueues.get(gameMode).pop();
  }

  popByGameMode(gameMode: GameMode) {
    const userId = this.matchQueues.get(gameMode).pop();

    this.userGameTypes.delete(userId);

    return userId;
  }

  isEmpty(gameMode: GameMode) {
    return this.matchQueues.get(gameMode).isEmpty();
  }
}
