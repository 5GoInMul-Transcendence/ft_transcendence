import { IMyChannel } from '@/types/IChannel';
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

export const userState = atom <string | null> ({
  key: 'userState',
  default: null,
})