import { useState } from 'react';
import useInput from '@/hooks/useInput';
import Input from '@/component/Input';
import Button from '@/component/Buttons/Button';
import InvalidMsg from './InvalidMsg';
import axios from 'axios';

export default function SetNick() {
  const [keyword, , onChangeKeyword] = useInput('');
  const [invalidMsg, setInvalidMsg] = useState<string>('');

  const setNickHandler = async () => {
    if (keyword === '') {
      setInvalidMsg(() => 'nickname is empty');
      return;
    }
    axios.put('/me/nickname', { nickname: keyword }).then((data) => {
      if (data.data.resStatus.code === '0000') {
        //TODO: nickname 변경 성공 후 처리
      }
      if (data.data.resStatus.code === '0001')
        setInvalidMsg(() => data.data.resStatus.message);
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
