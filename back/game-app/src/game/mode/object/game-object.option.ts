export const SCREEN_WIDTH = 1200;
export const SCREEN_HEIGHT = 720;

export class BallOption {
  ballRadius: number;
  ballSpeed: number;
  ballXDirection: number;
  ballYDirection: number;

  constructor() {
    this.ballRadius = 12.5;
    this.ballSpeed = 8;
    this.ballXDirection = 1;
    this.ballYDirection = 1;
  }
}

export class PaddleOption {
  paddleSpeed: number;
  paddleWidth: number;
  paddleHeight: number;

  constructor() {
    this.paddleWidth = 25;
    this.paddleHeight = 100;
    this.paddleSpeed = 50;
  }
}
