import { useState } from 'react';
import useInput from '@/hooks/useInput';
import Input from '@/component/Input';
import Button from '@/component/Buttons/Button';
import InvalidMsg from './InvalidMsg';

export default function AddFriend() {
  const [keyword, , onChangeKeyword] = useInput('');
  const [invalidMsg, setInvalidMsg] = useState<string>('');

  const addFriendHandler = async () => {
    if (keyword === '') {
      setInvalidMsg(() => 'nickname is empty');
      return;
    }
    /* todo: 검색 data 요청, response에 따라 inValidMsg 설정 
		예시)
		'No such user.'
		'Already your friend.'
		'You can't add yourself.'
		'You have already sent a friend request.'
		...
		*/
    setInvalidMsg(() => 'No such user.');
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
      <Button text='add' color='green' onClick={addFriendHandler} />
    </>
  );
}
