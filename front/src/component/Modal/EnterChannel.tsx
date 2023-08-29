import { useState } from 'react';
import useInput from '@/hooks/useInput';
import Input from '@/component/Input';
import Button from '@/component/Buttons/Button';
import InvalidMsg from './InvalidMsg';
import { styled } from 'styled-components';
import axios from 'axios';

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

  const setPasswordHandler = async () => {
    if (keyword === '') {
      setInvalidMsg(() => 'password is empty');
      return;
    }
    axios.post(`/channel/${channelId}/password`).then((data) => {
      if (data.data.resStatus.code === '0001')
        setInvalidMsg(() => 'invalid passowrd');
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
