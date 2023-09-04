import { SCREEN_HEIGHT, SCREEN_WIDTH } from './game-object.option';

export class GameObjects {
  p1: {
    x: number;
    y: number;
  };
  p2: {
    x: number;
    y: number;
  };
  b: {
    x: number;
    y: number;
  };

  constructor() {
    this.p1 = { x: 0, y: 0 };
    this.p2 = { x: SCREEN_WIDTH - 25, y: SCREEN_HEIGHT - 100 };
    this.b = { x: 0, y: 0 };
  }
}

export class GameScore {
  p1: {
    score: number;
  };
  p2: {
    score: number;
  };

  constructor() {
    this.p1 = { score: 0 };
    this.p2 = { score: 0 };
  }
}
