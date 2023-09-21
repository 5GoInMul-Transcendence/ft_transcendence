export interface IMyChannel {
  id: number;
  name: string;
  recentMessage: IMessage;
}

export interface IAllChannel {
  id: number;
  name: string;
}

export interface IChatRoom {
  id: number;
  name: string;
  role: string;
  mode: string;
  recentMessage: IMessage[];
}

export interface IChatUser {
  id: number;
  nickname: string;
  avatar: string;
  role: 'owner' | 'admin' | 'user';
}

export interface IMessage {
  nickname: string;
  content: string;
}
