export interface IGame {
  gameKey: string;
  p1: {
    id: number;
    nickname: string;
    avatar: string;
  };
  p2: {
    id: number;
    nickname: string;
    avatar: string;
  };
  resStatus: {
    code: number;
    message: string;
  };
}
