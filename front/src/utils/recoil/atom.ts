import { atom } from 'recoil';

interface modalType {
  type: string;
  modalProps?: any;
}

export const modalState = atom<modalType | null>({
  key: 'modalState',
  default: null,
});

export const invaildMsg = atom<string>({
  key: 'invalidMsg',
  default: '',
});
