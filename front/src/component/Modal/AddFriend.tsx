import useInput from '@/hooks/useInput';
import Input from '@/component/Input';
import Button from '@/component/Buttons/Button';
import InvalidMsg from './InvalidMsg';
import { useRecoilState } from 'recoil';
import { invalidMsgState } from '@/utils/recoil/atom';
import { axiosInstance } from '@/utils/axios';
import { useSWRConfig } from 'swr';

export default function AddFriend() {
  const { mutate } = useSWRConfig();
  const [keyword, , onChangeKeyword] = useInput('');
  const [invalidMsg, setInvalidMsg] = useRecoilState(invalidMsgState);

  const addFriendHandler = async () => {
    if (keyword === '') {
      setInvalidMsg(() => 'nickname is empty');
      return;
    }
    axiosInstance.post('/friend', { nickname: keyword }).then(() => {
      mutate('/friend/list');
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
      <Button text='add' color='green' onClick={addFriendHandler} />
    </>
  );
}
