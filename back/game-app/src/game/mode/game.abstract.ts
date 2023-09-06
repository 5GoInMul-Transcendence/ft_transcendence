import { v4 as uuid } from 'uuid';
import {
  BallOption,
  PaddleOption,
  ScoreOption,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from './object/game-object.option';
import { GameObjects, GameScore } from './object/game-object';
import { GamePlayResult } from './enums/game-play-result.enum';
import { PlayerNumber } from '../enums/player-number.enum';
import { PlayerAction } from './enums/player-action.enum';

export abstract class AbstractGame {
  public gameId = uuid();
  public score: GameScore;
  public objects: GameObjects;
  public winner: PlayerNumber;
  protected scoreOption: ScoreOption;
  protected ballOption: BallOption;
  protected paddleOption: PaddleOption;

  constructor() {
    this.scoreOption = new ScoreOption();
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

    /* 화면 좌 충돌 체크 (= 득점) */
    if (this.objects.b.x <= 0) {
      this.score.p2.score += 1;

      /* p2 최대 스코어에 도달시 */
      if (this.score.p2.score >= this.scoreOption.max) {
        this.winner = PlayerNumber.P2;
        return GamePlayResult.GAME_END;
      } else {
        this.initObject();
        return GamePlayResult.ROUND_END;
      }
    }
    /* 화면 우 충돌 체크 (= 득점) */
    if (this.objects.b.x >= SCREEN_WIDTH) {
      this.score.p1.score += 1;

      /* p1 최대 스코어에 도달시 */
      if (this.score.p1.score >= this.scoreOption.max) {
        this.winner = PlayerNumber.P1;
        return GamePlayResult.GAME_END;
      } else {
        this.initObject();
        return GamePlayResult.ROUND_END;
      }
    }

    /* p1 패들 충돌 체크 */
    if (
      this.objects.b.x <=
      this.objects.p1.x + this.paddleOption.width + this.ballOption.radius
    ) {
      if (
        this.objects.b.y > this.objects.p1.y - this.ballOption.radius &&
        this.objects.b.y < this.objects.p1.y + this.paddleOption.height + this.ballOption.radius
      ) {
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
        this.ballOption.xDirection *= -1;
        this.ballOption.speed += 0.05;
      }
    }

    return GamePlayResult.ROUND_PROGRESS;
  }

  updateObject(playerNumber: PlayerNumber, playerAction: PlayerAction) {
    if (playerAction == PlayerAction.PADDLE_UP) {
      if (playerNumber == PlayerNumber.P1 && this.objects.p1.y - this.paddleOption.speed >= 0) {
        this.objects.p1.y -= this.paddleOption.speed;
      }
      if (playerNumber == PlayerNumber.P2 && this.objects.p2.y - this.paddleOption.speed >= 0) {
        this.objects.p2.y -= this.paddleOption.speed;
      }
    }

    if (playerAction == PlayerAction.PADDLE_DOWN) {
      if (
          playerNumber == PlayerNumber.P1 &&
        this.objects.p1.y + this.paddleOption.height + this.paddleOption.speed <= SCREEN_HEIGHT
      ) {
        this.objects.p1.y += this.paddleOption.speed;
      }
      if (
          playerNumber == PlayerNumber.P2 &&
        this.objects.p2.y +  this.paddleOption.height + this.paddleOption.speed <= SCREEN_HEIGHT
      ) {
        this.objects.p2.y += this.paddleOption.speed;
      }
    }
  }

  /* 게임 시작 전, 라운드 전, 게임 오브젝트를 초기화합니다. */
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
