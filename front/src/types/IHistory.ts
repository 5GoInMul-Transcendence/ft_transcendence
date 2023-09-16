export interface IHistory {
  data: [
    {
      gameId: number;
      createdTime: string;
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
  ];
}