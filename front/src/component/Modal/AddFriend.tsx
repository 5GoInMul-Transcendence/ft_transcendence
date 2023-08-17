import { useState } from 'react';
import useInput from '@/hooks/useInput';
import Input from '@/component/Input';
import Button from '@/component/Buttons/Button';
import InvalidMsg from './InvalidMsg';

export default function AddFriend() {
  const [keyword, , onChangeKeyword] = useInput('');
  const [inValidMsg, setInValidMsg] = useState<string>('');

  const addFriendHandler = async () => {
    /* todo: 검색 data 요청, response에 따라 inValidMsg 설정 
		예시)
		'No such user.'
		'Already your friend.'
		'You can't add yourself.'
		'You have already sent a friend request.'
		...
		*/
    setInValidMsg(() => 'No such user.');
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
      <InvalidMsg text={inValidMsg} />
      <Button text='Add' color='green' onClick={addFriendHandler} />
    </>
  );
}
