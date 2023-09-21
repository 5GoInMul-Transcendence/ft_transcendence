import useInput from '@/hooks/useInput';
import Input from '@/component/Input';
import Buttons from '@/component/Buttons';
import InvalidMsg from './InvalidMsg';
import styled from 'styled-components';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { invalidMsgState, modalState } from '@/utils/recoil/atom';

import { axiosInstance } from '@/utils/axios';

interface SetChannelProps {
  channelName: string;
  channelId: number;
}
export default function SetChannel({
  channelName,
  channelId,
}: SetChannelProps) {
  const setModal = useSetRecoilState(modalState);
  const [password, , onChangePassword] = useInput('');
  const [passwordCheck, , onChangePasswordCheck] = useInput('');
  const [invalidMsg, setInvalidMsg] = useRecoilState(invalidMsgState);

  const cancelSetChannelHandler = () => {
    setModal(null);
  };
  const saveSetChannelHandler = async () => {
    if (password === '') {
      axiosInstance.post(`/channel/setting/${channelId}`, {
        mode: 'public',
      });
      return;
    }
    if (password !== passwordCheck) {
      setInvalidMsg(() => 'password mismatch');
      return;
    }
    axiosInstance
      .put(`/channel/setting/${channelId}`, {
        mode: 'protected',
        password,
      })
      .then((data) => {
        if (data.data.resStatus.code === '0000') cancelSetChannelHandler();
        if (data.data.resStatus.code === '0001')
          setInvalidMsg(() => data.data.resStatus.message);
      });
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
