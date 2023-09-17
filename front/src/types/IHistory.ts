export interface IHistory {
  gameId: number;
  createdDate: string;
  player1: {
    nickname: string;
    score: number;
    avatar: string;
  };
  player2: {
    nickname: string;
    score: number;
    avatar: string;
  };
}
