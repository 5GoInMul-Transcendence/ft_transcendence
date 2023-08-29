export interface IMe {
  id: number;
  nickname: string;
  avatar: string;
  gameRecord: {
    win: number;
    loss: number;
    ladderLevel: number;
    achievement: string[] | null;
  };
}
