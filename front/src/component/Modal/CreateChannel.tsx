import { useState } from 'react';
import useInput from '@/hooks/useInput';
import Input from '@/component/Input';
import Buttons from '@/component/Buttons';
import InvalidMsg from './InvalidMsg';
import styled from 'styled-components';

export default function CreateChannel() {
  const [password, , onChangePassword] = useInput('');
  const [passwordCheck, , onChangePasswordCheck] = useInput('');
  const [channelName, , onChangeChannelName] = useInput('');
  const [invalidMsg, setInvalidMsg] = useState<string>('');

  const cancelCreateChannelHandler = () => {
    /* todo: modal recoil set null */
  };
  const createChannelHandler = async () => {
    if (password === '') {
      setInvalidMsg(() => 'password is empty');
      return;
    }
    if (password !== passwordCheck) {
      setInvalidMsg(() => 'password mismatch');
      return;
    }
    setInvalidMsg(() => '');
    /* todo: 비밀번호 data 요청, response에 따라 inValidMsg 설정 
		예시)
		'invalid passowrd'
		...
		*/
  };
  return (
    <Wrapper>
      <Input
        label='channel name'
        type='text'
        value={channelName}
        onChange={onChangeChannelName}
        maxLength={12}
      />
      <br />
      <br />
      <Input
        label='password'
        type='password'
        value={password}
        onChange={onChangePassword}
        maxLength={12}
      />
      <Input
        label='repeat password'
        type='password'
        value={passwordCheck}
        onChange={onChangePasswordCheck}
        maxLength={12}
      />
      <InvalidMsg text={invalidMsg} />
      <Buttons
        leftButton={{
          text: 'cancel',
          color: 'grey',
          onClick: cancelCreateChannelHandler,
        }}
        rightButton={{
          text: 'create!',
          color: 'green',
          onClick: createChannelHandler,
        }}
      />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  ${({ theme }) => theme.flex.centerColumn};
  justify-content: space-between;
  width: 100%;
`;
