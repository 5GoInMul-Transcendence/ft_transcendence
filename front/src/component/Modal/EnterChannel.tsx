import { useState } from 'react';
import useInput from '@/hooks/useInput';
import Input from '@/component/Input';
import Button from '@/component/Buttons/Button';
import InvalidMsg from './InvalidMsg';
import { styled } from 'styled-components';
import { axiosInstance } from '@/utils/axios';
import { useRouter } from 'next/navigation';
import { useSetRecoilState } from 'recoil';
import { modalState } from '@/utils/recoil/atom';

interface EnterChannelProps {
  channelName: string;
  channelId: number;
}
export default function EnterChannel({
  channelName,
  channelId,
}: EnterChannelProps) {
  const [keyword, , onChangeKeyword] = useInput('');
  const [invalidMsg, setInvalidMsg] = useState<string>('');
  const setModal = useSetRecoilState(modalState);
  const router = useRouter();

  const setPasswordHandler = async () => {
    if (keyword === '') {
      setInvalidMsg(() => 'password is empty');
      return;
    }
    axiosInstance.post(`/channel/${channelId}/password`, {password: keyword}).then((data) => {
      router.push(`/chats/${channelId}`);
      setModal(null);
    });
  };

  return (
    <>
      <ChannelName>{`Channel ${channelName}`}</ChannelName>
      <Input
        label='password'
        type='password'
        value={keyword}
        onChange={onChangeKeyword}
        maxLength={12}
      />
      <InvalidMsg text={invalidMsg} />
      <Button text='submit' color='green' onClick={setPasswordHandler} />
    </>
  );
}

const ChannelName = styled.div`
  ${({ theme }) => theme.flex.center};
  margin: 3rem 0;
  font-size: ${({ theme }) => theme.fontSize.normal};
`;
