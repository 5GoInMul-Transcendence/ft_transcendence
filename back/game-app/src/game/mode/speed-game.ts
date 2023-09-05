import { AbstractGame } from './game.abstract';

export class SpeedGame extends AbstractGame {
  constructor() {
    super();
    this.ballOption.speed = 12;
  }
}
