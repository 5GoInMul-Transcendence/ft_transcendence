export interface IMyChannel {
  id: number;
  name: string;
  recentMessage: {
    nickname: string;
    message: string;
  };
}
export interface IAllChannel {
  id: number;
  name: string;
}
export interface IChatRoom {
  id: number;
  name: string;
  role: string;
  env: string;
  recentMessage: IMessage[];
}
export interface IChatUser {
  id: number;
  nickname: string;
  avatar: string;
  role: 'owner' | 'admin' | 'user';
}
export interface IMessage {
  id: number;
  nickname: string;
  content: string;
}
