import { AbstractGame } from './mode/game.abstract';
import { GameStatus } from './mode/enums/game-status.enum';
import { GamePlayResult } from './mode/enums/game-play-result.enum';
import { ProcessStatus } from './core/enums/process-status.enum';
import { PlayerAction } from './player/enums/player-action.enum';
import { Player } from './player/enums/player';
import { PlayerNumber } from './player/enums/player-number.enum';
import { PlayerStatus } from './player/enums/player-status.enum';

export class GameProcessUnit {
  game: AbstractGame;
  players: Player[];

  playGameByOneFrame() {
    const playResult = this.game.play();

    if (playResult == GamePlayResult.ROUND_PROGRESS) {
      for (let i = 0; i < this.players.length; i++) {
        this.players[i].client.emit('updateObject', this.game.objects);
      }

      return ProcessStatus.PROGRESS;
    }

    if (playResult == GamePlayResult.ROUND_END) {
      this.game.status = GameStatus.STANDBY;

      for (let i = 0; i < this.players.length; i++) {
        this.players[i].status = PlayerStatus.GAME_READY;
        this.players[i].client.emit('updateObject', this.game.objects);
        this.players[i].client.emit('updateScore', this.game.score);
        this.players[i].client.emit('infoGame', {
          status: GameStatus.STANDBY,
        });
      }

      return ProcessStatus.END;
    }

    if (playResult == GamePlayResult.GAME_END) {
      for (let i = 0; i < this.players.length; i++) {
        this.players[i].status = PlayerStatus.GAME_END;
        this.players[i].client.emit('updateScore', this.game.score);
        this.players[i].client.emit('infoGame', {
          status: GameStatus.END,
          message: this.game.winner,
        });
      }

      this.players[0].client.disconnect();
      return ProcessStatus.END;
    }
  }

  updateObject(playerNumber: PlayerNumber, playerAction: PlayerAction) {
    if (this.game.status != GameStatus.START) {
      return;
    }

    this.game.updateObject(playerNumber, playerAction);
  }
}
