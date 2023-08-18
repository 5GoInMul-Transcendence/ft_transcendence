import { useState } from 'react';
import useInput from '@/hooks/useInput';
import Input from '@/component/Input';
import Button from '@/component/Buttons/Button';
import InvalidMsg from './InvalidMsg';

export default function SetNick() {
  const [keyword, , onChangeKeyword] = useInput('');
  const [invalidMsg, setInvalidMsg] = useState<string>('');

  const setNickHandler = async () => {
    /* todo: 검색 data 요청, response에 따라 inValidMsg 설정 
		예시)
		'Nickname already exist'
		...
		*/
    setInvalidMsg(() => 'Nickname already exist');
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
