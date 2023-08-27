import { useState } from 'react';
import useInput from '@/hooks/useInput';
import Input from '@/component/Input';
import Buttons from '@/component/Buttons';
import InvalidMsg from './InvalidMsg';
import styled from 'styled-components';

export default function SetChannel() {
  const [password, , onChangePassword] = useInput('');
  const [passwordCheck, , onChangePasswordCheck] = useInput('');
  const [invalidMsg, setInvalidMsg] = useState<string>('');
  const channelName = '11';

  const cancelSetChannelHandler = () => {
    /* todo: modal recoil set null */
  };
  const saveSetChannelHandler = async () => {
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
      <ChannelName>{`-- channel ${channelName} --`}</ChannelName>
      <Input
        label='new password'
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
          onClick: cancelSetChannelHandler,
        }}
        rightButton={{
          text: 'save',
          color: 'green',
          onClick: saveSetChannelHandler,
        }}
      />
    </Wrapper>
  );
}

const ChannelName = styled.div`
  ${({ theme }) => theme.flex.center};
  margin: 0 0 3rem;
  font-size: ${({ theme }) => theme.fontSize.normal};
`;

const Wrapper = styled.div`
  ${({ theme }) => theme.flex.centerColumn};
  justify-content: space-between;
  width: 100%;
`;
