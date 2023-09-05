import { AbstractGame } from './game.abstract';

export class PaddleGame extends AbstractGame {
  constructor() {
    super();
    this.paddleOption.height /= 2;
  }
}
