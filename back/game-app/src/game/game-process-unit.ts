import { GameUser } from './gameuser/game-user';
import { AbstractGame } from './mode/game.abstract';
import { GameActionStatus } from './enums/gam-action-status.enum';
import { GamePlayResult } from './mode/enums/game-play-result.enum';
import { ProcessStatus } from './core/enums/process-status.enum';
import { EndGameDto } from './dto/end-game.dto';
import { GameUserStatus } from './enums/game-user-status.enum';
import { Builder } from 'builder-pattern';
import { PlayerNumber } from './enums/player-number.enum';
import { PlayerAction } from './player/enums/player-action.enum';
import { Player } from './player/enums/player';

export class GameProcessUnit {
  game: AbstractGame;
  players: Player[];
  notifyEndGame: (dto: EndGameDto) => Promise<void>;

  playGameByOneFrame() {
    const playResult = this.game.play();

    if (playResult == GamePlayResult.ROUND_PROGRESS) {
      for (let i = 0; i < this.players.length; i++) {
        this.players[i].client.emit('updateObject', this.game.objects);
      }

      return ProcessStatus.PROGRESS;
    }

    if (playResult == GamePlayResult.ROUND_END) {
      this.gameStatus = GameActionStatus.STANDBY;

      for (let i = 0; i < this.players.length; i++) {
        this.players[i].status = GameUserStatus.GAME_READY;
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
        this.players[i].status = GameUserStatus.DEFAULT;
        this.players[i].client.emit('updateScore', this.game.score);
        this.players[i].client.emit('infoGame', {
          status: GameStatus.END,
          message: this.game.winner,
        });
      }

      this.notifyEndGame(
        Builder(EndGameDto)
          .endGame(this.game)
          .gamePlayers(this.gamePlayers)
          .build(),
      );

      return ProcessStatus.END;
    }
  }

  updateObject(playerNumber: PlayerNumber, playerAction: PlayerAction) {
    if (this.gameStatus != GameActionStatus.PLAY) {
      return;
    }

    this.game.updateObject(playerNumber, playerAction);
  }
}
