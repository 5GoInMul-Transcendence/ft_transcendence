import useInput from '@/hooks/useInput';
import Input from '@/component/Input';
import Button from '@/component/Buttons/Button';
import InvalidMsg from './InvalidMsg';
import { useRecoilState, useSetRecoilState } from 'recoil';
import {
  friendListState,
  invalidMsgState,
  modalState,
} from '@/utils/recoil/atom';
import { axiosInstance } from '@/utils/axios';

export default function AddFriend() {
  const [keyword, , onChangeKeyword] = useInput('');
  const [invalidMsg, setInvalidMsg] = useRecoilState(invalidMsgState);
  const [, setFriends] = useRecoilState(friendListState);

  const setModal = useSetRecoilState(modalState);

  const addFriendHandler = async () => {
    if (keyword === '') {
      setInvalidMsg(() => 'nickname is empty');
      return;
    }
    axiosInstance.post('/friend', { nickname: keyword }).then(() => {
      axiosInstance.get('/friend/list').then((res) => {
        setFriends(res.data.data);
      });
      setModal(null);
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
