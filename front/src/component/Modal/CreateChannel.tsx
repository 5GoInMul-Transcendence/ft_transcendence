import { useState } from 'react';
import useInput from '@/hooks/useInput';
import Input from '@/component/Input';
import Buttons from '@/component/Buttons';
import InvalidMsg from './InvalidMsg';
import styled from 'styled-components';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { invalidMsgState, modalState } from '@/utils/recoil/atom';
import { axiosInstance } from '@/utils/axios';
import { useRouter } from 'next/navigation';

export default function CreateChannel() {
  const [channelName, , onChangeChannelName] = useInput('');
  const [password, , onChangePassword] = useInput('');
  const [passwordCheck, , onChangePasswordCheck] = useInput('');
  const [mode, setMode] = useState('public');
  const [invalidMsg, setInvalidMsg] = useRecoilState(invalidMsgState);

  const setModal = useSetRecoilState(modalState);
  const router = useRouter();

  const onChangeMode = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMode(e.target.value);
  };
  const cancelCreateChannelHandler = () => {
    setModal(null);
  };
  const createChannelHandler = async () => {
    setInvalidMsg('');
    if (channelName === '' || channelName.trim() === '') {
      setInvalidMsg(() => '채널이름을 입력해주세요!');
      return;
    }
    if (mode === 'protected') {
      if (password === '' || password.trim() === '') {
        setInvalidMsg(() => '패스워드를 입력해주세요!');
        return;
      }
      if (password !== passwordCheck) {
        setInvalidMsg(() => '입력하신 패스워드가 같지 않습니다!');
        return;
      }
      axiosInstance
        .post(`/channel/${mode}`, { name: channelName, password })
        .then((data) => {
          router.push(`/chats/${data.data.data.id}`);
          setModal(null);
        });
      return;
    }
    axiosInstance
      .post(`/channel/${mode}`, { name: channelName })
      .then((data) => {
        router.push(`/chats/${data.data.data.id}`);
        setModal(null);
      });
  };
  return (
    <Wrapper>
      <Input
        label='channel name'
        type='text'
        value={channelName}
        onChange={onChangeChannelName}
        maxLength={32}
      />
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
        </>
      )}
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
