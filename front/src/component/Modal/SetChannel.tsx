import useInput from '@/hooks/useInput';
import Input from '@/component/Input';
import Buttons from '@/component/Buttons';
import InvalidMsg from './InvalidMsg';
import styled from 'styled-components';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { invalidMsgState, modalState } from '@/utils/recoil/atom';
import { axiosInstance } from '@/utils/axios';
import { useState } from 'react';

interface SetChannelProps {
  channelName: string;
  channelId: number;
  channelMode: string;
}
export default function SetChannel({
  channelName,
  channelId,
  channelMode,
}: SetChannelProps) {
  const setModal = useSetRecoilState(modalState);
  const [password, , onChangePassword] = useInput('');
  const [passwordCheck, , onChangePasswordCheck] = useInput('');
  const [mode, setMode] = useState(channelMode);
  const [invalidMsg, setInvalidMsg] = useRecoilState(invalidMsgState);

  const onChangeMode = (e) => {
    setMode(e.target.value);
  };

  const cancelSetChannelHandler = () => {
    setModal(null);
  };
  const saveSetChannelHandler = async () => {
    if (mode === 'public') {
      axiosInstance
        .post(`/channel/setting/${channelId}`, {
          mode: 'public',
        })
        .then(() => {
          setModal(null);
        });
      return;
    }
    if (password !== passwordCheck) {
      setInvalidMsg(() => 'password mismatch');
      return;
    }
    axiosInstance
      .put(`/channel/setting/${channelId}`, {
        mode: mode,
        password,
      })
      .then(() => {
        setModal(null);
      });
  };

  return (
    <Wrapper>
      <ChannelName>{`-- channel ${channelName} --`}</ChannelName>
      <RadioWrapper>
        <RadioInput
          type='radio'
          name='mode'
          value='public'
          onChange={onChangeMode}
          checked={mode === 'public'}
        />
        public
        <RadioInput
          type='radio'
          name='mode'
          value='protected'
          onChange={onChangeMode}
          checked={mode === 'protected'}
        />
        protected
      </RadioWrapper>
      {mode === 'protected' && (
        <>
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
        </>
      )}

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

const RadioWrapper = styled.div`
  ${({ theme }) => theme.flex.center};
  margin-bottom: 1rem;
`;

const RadioInput = styled.input`
  border: 1.5px solid black;
  border-radius: 50%;
  width: 1rem;
  height: 1rem;
  margin: 0 0.5rem 0 1rem;
  &:checked {
    background-color: ${({ theme }) => theme.colors.green};
  }
`;
