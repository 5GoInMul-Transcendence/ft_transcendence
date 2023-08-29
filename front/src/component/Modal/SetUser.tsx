import ProfileImage from '@/component/ProfileImage';
import Buttons from '@/component/Buttons';
import Toggle from '@/component/Toggle';
import useToggle from '@/hooks/useToggle';
import styled from 'styled-components';
import axios from 'axios';
import useSwrFetcher from '@/hooks/useSwrFetcher';
import { IUserSetting } from '@/types/IUser';

interface SetUserProps {
  userid: string;
  nickname: string;
  channelid: string;
}

export default function SetUser({ userid, nickname, channelid }: SetUserProps) {
  const [data, resStatus] = useSwrFetcher<IUserSetting>(
    `/channel/setting/${channelid}/${userid}`
  );
  const [admin, onChangeAdmin] = useToggle(data?.admin ?? false);
  const [mute, onChangeMute] = useToggle(data?.mute ?? false);

  const banUserHandler = async () => {
    axios.put(`/channel/setting/${channelid}/user`, {
      id: userid,
      status: 'ban',
    });
  };
  const kickUserHandler = async () => {
    axios.put(`/channel/setting/${channelid}/user`, {
      id: userid,
      status: 'kick',
    });
  };
  const adminUserHandler = async () => {
    axios
      .put(`/channel/setting/${channelid}/user`, {
        id: userid,
        status: 'admin',
      })
      .then((data) => {
        if (data.data.resStatus.code === '0000') onChangeAdmin();
      });
  };
  const muteUserHandler = async () => {
    axios
      .put(`/channel/setting/${channelid}/user`, {
        id: userid,
        status: 'mute',
      })
      .then((data) => {
        if (data.data.resStatus.code === '0000') onChangeMute();
      });
  };
  return (
    <Wrapper>
      <WrapperSection>
        <div>
          <ProfileImage url='' size='150px' />
          <div>{nickname}</div>
        </div>
        <div>
          <Toggle
            text='admin'
            color='green'
            checked={admin}
            onToggle={adminUserHandler}
          />
          <Toggle
            text='mute'
            color='green'
            checked={mute}
            onToggle={muteUserHandler}
          />
        </div>
      </WrapperSection>
      <Buttons
        leftButton={{
          text: 'ban',
          color: 'pink',
          onClick: banUserHandler,
        }}
        rightButton={{
          text: 'kick',
          color: 'grey',
          onClick: kickUserHandler,
        }}
      />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  ${({ theme }) => theme.flex.centerColumn};
  justify-content: space-between;
  width: 100%;
  height: 18rem;
`;

const WrapperSection = styled.section`
  ${({ theme }) => theme.flex.spaceBetween};
  width: 80%;
  div:nth-child(2) {
    margin-top: 1.5rem;
    text-align: center;
  }
`;
