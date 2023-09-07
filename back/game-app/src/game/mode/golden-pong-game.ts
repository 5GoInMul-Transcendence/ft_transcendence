import { AbstractGame } from './game.abstract';

export class GoldenPongGame extends AbstractGame {
  constructor() {
    super();

    this.scoreOption.max = 1;
    this.ballOption.speed = 3;
    this.ballOption.speedUp = 0.5;
  }
}
