import { v4 as uuid } from 'uuid';
import { BallOption, PaddleOption } from './object/game-object.option';
import { GameObjects, GameScore } from './object/game-object';

export abstract class AbstractGame {
  private gameId = uuid();
  private ballOption: BallOption;
  private paddleOption: PaddleOption;
  private gameObjects: GameObjects;
  private gameScore: GameScore;

  constructor() {
    this.ballOption = new BallOption();
    this.paddleOption = new PaddleOption();
    this.gameObjects = new GameObjects();
    this.gameScore = new GameScore();

    this.initRandomBallOption();
  }

  private initRandomBallOption() {
    this.ballOption.ballXDirection = Math.round(Math.random()) ? 1 : -1;
    this.ballOption.ballYDirection = Math.round(Math.random()) ? 1 : -1;
  }
}
