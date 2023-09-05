import { GameUser } from './gameuser/game-user';
import { AbstractGame } from './mode/game.abstract';
import { GameActionStatus } from './enums/gam-action-status.enum';
import { GamePlayResult } from './mode/enums/game-play-result.enum';
import { ProcessStatus } from './core/enums/process-status.enum';
import { EndGameDto } from './dto/end-game.dto';
import { GameUserStatus } from './enums/game-user-status.enum';

export class GameProcessUnit {
  game: AbstractGame;
  gamePlayers: GameUser[];
  gameStatus: GameActionStatus;
  notifyEndGame: (dto: EndGameDto) => Promise<void>;

  playGameByOneFrame() {
    const playResult = this.game.play();

    if (playResult == GamePlayResult.ROUND_PROGRESS) {
      for (let i = 0; i < this.gamePlayers.length; i++) {
        this.gamePlayers[i].client.emit('updateObject', this.game.score);
      }
    }

    if (playResult == GamePlayResult.ROUND_END && this.isGameOver()) {
      for (let i = 0; i < this.gamePlayers.length; i++) {
        this.gamePlayers[i].status = GameUserStatus.DEFAULT;
        this.gamePlayers[i].client.emit('updateScore', this.game.score);
        this.gamePlayers[i].client.emit('infoGame', {
          status: GameActionStatus.END,
        });
      }
      return ProcessStatus.END;
    }

    if (playResult == GamePlayResult.ROUND_END) {
      this.gameStatus = GameActionStatus.STANDBY;

      for (let i = 0; i < this.gamePlayers.length; i++) {
        this.gamePlayers[i].status = GameUserStatus.GAME_READY;
        this.gamePlayers[i].client.emit('updateObject', this.game.objects);
        this.gamePlayers[i].client.emit('updateScore', this.game.score);
        this.gamePlayers[i].client.emit('infoGame', {
          status: GameActionStatus.STANDBY,
        });
      }
    }

    return ProcessStatus.PROGRESS;
  }

  isGameOver() {
    return this.game.score.p1.score >= 5 || this.game.score.p2.score >= 5;
  }
}
