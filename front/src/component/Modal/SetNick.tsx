import { useState } from 'react';
import useInput from '@/hooks/useInput';
import Input from '@/component/Input';
import Button from '@/component/Buttons/Button';
import InvalidMsg from './InvalidMsg';
import axios from 'axios';
import { axiosInstance } from '@/utils/axios';
import { useSetRecoilState } from 'recoil';
import { modalState } from '@/utils/recoil/atom';

export default function SetNick() {
  const [keyword, , onChangeKeyword] = useInput('');
  const [invalidMsg, setInvalidMsg] = useState<string>('');
  const setModal = useSetRecoilState(modalState);

  const setNickHandler = async () => {
    if (keyword === '') {
      setInvalidMsg(() => 'nickname is empty');
      return;
    }
    axiosInstance.put('/me/nickname', { nickname: keyword }).then(() => {
      // setModal(null);
      // 성공 처리
    });
  };

  return (
    <>
      <Input
        label='Nickname'
        type='text'
        value={keyword}
        onChange={onChangeKeyword}
        maxLength={12}
      />
      <InvalidMsg text={invalidMsg} />
      <Button text='submit' color='green' onClick={setNickHandler} />
    </>
  );
}
