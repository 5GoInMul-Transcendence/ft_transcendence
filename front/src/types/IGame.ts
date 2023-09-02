export interface IGame {
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
  gamekey: string;
  resStatus: {
    code: number;
    message: string;
  };
}
