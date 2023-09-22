import { IMyChannel } from '@/types/IChannel';
import { IFriends } from '@/types/IFriends';
import { atom } from 'recoil';

interface modalType {
  type: string;
  modalProps?: any;
}

export const modalState = atom<modalType | null>({
  key: 'modalState',
  default: null,
});

export const invalidMsgState = atom<string>({
  key: 'invalidMsg',
  default: '',
});

export const recentMessageState = atom<IMyChannel | null>({
  key: 'recentMessageState',
  default: null,
});

export const gameModeState = atom<string>({
  key: 'gameModeState',
  default: '',
});

export const gameQueueState = atom<boolean>({
  key: 'gameQueueState',
  default: false,
});

export const userState = atom<string | null>({
  key: 'userState',
  default: null,
});

export const friendListState = atom<IFriends[] | undefined>({
  key: 'friendListState',
  default: undefined,
});
