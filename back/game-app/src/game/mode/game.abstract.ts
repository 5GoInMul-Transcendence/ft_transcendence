import { v4 as uuid } from 'uuid';
import {
  BallOption,
  PaddleOption,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from './object/game-object.option';
import { GameObjects, GameScore } from './object/game-object';
import { GamePlayResult } from './enums/game-play-result.enum';

export abstract class AbstractGame {
  public objects: GameObjects;
  public score: GameScore;
  public gameId = uuid();
  protected ballOption: BallOption;
  protected paddleOption: PaddleOption;

  constructor() {
    this.ballOption = new BallOption();
    this.paddleOption = new PaddleOption();
    this.objects = new GameObjects();
    this.score = new GameScore();

    this.initObject();
  }

  play() {
    /* 공 이동 */
    this.objects.b.x += this.ballOption.speed * this.ballOption.xDirection;
    this.objects.b.y += this.ballOption.speed * this.ballOption.yDirection;

    /* 화면 위 아래 충돌 체크 */
    if (this.objects.b.y <= 0 + this.ballOption.radius) {
      this.ballOption.yDirection *= -1;
    }
    if (this.objects.b.y >= SCREEN_HEIGHT - this.ballOption.radius) {
      this.ballOption.yDirection *= -1;
    }

    /* 화면 좌 우 충돌 체크 (= 득점) */
    if (this.objects.b.x <= 0) {
      this.score.p1.score += 1;
      this.initObject();
      return GamePlayResult.ROUND_END;
    }
    if (this.objects.b.x >= SCREEN_WIDTH) {
      this.score.p2.score += 1;
      this.initObject();
      return GamePlayResult.ROUND_END;
    }

    /* p1 패들 충돌 체크 */
    if (
      this.objects.b.x <=
      this.objects.p1.x + this.paddleOption.width + this.ballOption.radius
    ) {
      if (
        this.objects.b.y > this.objects.p1.y &&
        this.objects.b.y < this.objects.p1.y + this.paddleOption.height
      ) {
        this.objects.b.x = this.paddleOption.width - this.ballOption.radius - 1;
        this.ballOption.xDirection *= -1;
        this.ballOption.speed += 0.05;
      }
    }
    /* p2 패들 충돌 체크 */
    if (this.objects.b.x >= this.objects.p2.x) {
      if (
        this.objects.b.y > this.objects.p2.y &&
        this.objects.b.y < this.objects.p2.y + this.paddleOption.height
      ) {
        this.objects.b.x = this.objects.p2.x + this.ballOption.radius - 1;
        this.ballOption.xDirection *= -1;
        this.ballOption.speed += 0.05;
      }
    }

    return GamePlayResult.ROUND_PROGRESS;
  }

  isGameOver;
  private initObject() {
    this.objects.p1.x = 0;
    this.objects.p1.y = 0;
    this.objects.p2.x = SCREEN_WIDTH - this.paddleOption.width;
    this.objects.p2.y = SCREEN_HEIGHT - this.paddleOption.height;
    this.objects.b.x = SCREEN_WIDTH / 2;
    this.objects.b.y = SCREEN_HEIGHT / 2;

    this.ballOption.xDirection = Math.round(Math.random()) ? 1 : -1;
    this.ballOption.yDirection = Math.round(Math.random()) ? 1 : -1;
  }
}
