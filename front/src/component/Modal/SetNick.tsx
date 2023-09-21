import useInput from '@/hooks/useInput';
import Input from '@/component/Input';
import Button from '@/component/Buttons/Button';
import InvalidMsg from './InvalidMsg';
import { axiosInstance } from '@/utils/axios';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { invalidMsgState, modalState } from '@/utils/recoil/atom';
import { useSWRConfig } from 'swr';

export default function SetNick() {
  const { mutate } = useSWRConfig();
  const [keyword, , onChangeKeyword] = useInput('');
  const [invalidMsg, setInvalidMsg] = useRecoilState(invalidMsgState);
  const setModal = useSetRecoilState(modalState);

  const setNickHandler = async () => {
    if (keyword === '') {
      setInvalidMsg(() => 'nickname is empty');
      return;
    }
    axiosInstance.put('/me/nickname', { nickname: keyword }).then((res) => {
      if (res === undefined) return;
      mutate('/me');
      mutate('/me/details');
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
      <Button text='submit' color='green' onClick={setNickHandler} />
    </>
  );
}
