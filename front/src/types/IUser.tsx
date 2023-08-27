export interface IUser {
  id: number;
  nickname: string;
  avatar: string;
  gameRecord: {
    win: number;
    lose: number;
    ladderLevel: number;
    achievement: string[] | null;
  };
}

export interface IUserDetail {
  id: 1;
  nickname: string;
  avatar: string;
  mail: string | null;
  phone: string | null;
  twoFactor: 'mail' | 'phone' | 'disabled';
}
