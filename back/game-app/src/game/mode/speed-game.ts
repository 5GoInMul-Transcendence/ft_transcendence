import { AbstractGame } from './game.abstract';

export class SpeedGame extends AbstractGame {
  constructor(gameId: string) {
    super(gameId);

    this.ballOption.speed = 12;
  }
}
