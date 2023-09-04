export const SCREEN_WIDTH = 1200;
export const SCREEN_HEIGHT = 720;

export class BallOption {
  radius: number;
  speed: number;
  xDirection: number;
  yDirection: number;

  constructor() {
    this.radius = 12.5;
    this.speed = 8;
    this.xDirection = 1;
    this.yDirection = 1;
  }
}

export class PaddleOption {
  speed: number;
  width: number;
  height: number;

  constructor() {
    this.width = 25;
    this.height = 100;
    this.speed = 50;
  }
}
