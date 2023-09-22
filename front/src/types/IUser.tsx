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

export interface IUserFriedns extends IUser {
  isBlock: boolean;
  isFriend: boolean;
}

export interface IUserDetail {
  id: 1;
  nickname: string;
  avatar: string;
  mail: string | null;
  phone: string | null;
  twoFactor: 'mail' | 'phone' | 'disabled';
}

export interface IUserSetting {
  admin: boolean;
  mute: boolean;
  ban: boolean;
}
