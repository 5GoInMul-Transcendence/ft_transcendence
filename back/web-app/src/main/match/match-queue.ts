import { Queue } from '@datastructures-js/queue';
import { GameMode } from '../../game/enums/game-mode.enum';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MatchQueue {
  private matchQueues: Map<GameMode, Queue<number>>;
  private userGameModes: Map<number, GameMode>;

  constructor() {
    this.matchQueues = new Map<GameMode, Queue<number>>();
    this.userGameModes = new Map<number, GameMode>();

    for (const gameMode of Object.values(GameMode)) {
      this.matchQueues.set(gameMode, new Queue<number>());
    }
  }

  push(gameMode: GameMode, userId: number) {
    this.matchQueues.get(gameMode).push(userId);

    this.userGameModes.set(userId, gameMode);
  }

  popByUserId(userId: number) {
    const gameMode = this.userGameModes.get(userId);

    this.userGameModes.delete(userId);

    return this.matchQueues.get(gameMode).pop();
  }

  popByGameMode(gameMode: GameMode) {
    const userId = this.matchQueues.get(gameMode).pop();

    this.userGameModes.delete(userId);

    return userId;
  }

  isEmpty(gameMode: GameMode) {
    return this.matchQueues.get(gameMode).isEmpty();
  }
}
