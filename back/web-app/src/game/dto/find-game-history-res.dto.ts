export class GameHistoryPlayer {
  id: number;
  avatar: string;
  nickname: string;
  score: number;
}

export class FindGameHistoryResDto {
  readonly gameId: number;
  readonly player1: GameHistoryPlayer;
  readonly player2: GameHistoryPlayer;
  readonly createdDate: string;
}
