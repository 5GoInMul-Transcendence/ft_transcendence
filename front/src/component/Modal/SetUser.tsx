import ProfileImage from '@/component/ProfileImage';
import Toggle from '@/component/Toggle';
import useToggle from '@/hooks/useToggle';
import styled from 'styled-components';
import useSwrFetcher from '@/hooks/useSwrFetcher';
import Button from '../Buttons/Button';
import { IUserSetting } from '@/types/IUser';
import { axiosInstance } from '@/utils/axios';

interface SetUserProps {
  userid: string;
  nickname: string;
  channelid: string;
}

export default function SetUser({ userid, nickname, channelid }: SetUserProps) {
  const data = useSwrFetcher<IUserSetting>(
    `/channel/setting/${channelid}/${userid}`
  );

  const [admin, onChangeAdmin] = useToggle(data?.admin ?? false);
  const [mute, onChangeMute] = useToggle(data?.mute ?? false);
  const [ban, onChangeBan] = useToggle(data?.mute ?? false);

  const banUserHandler = async () => {
    axiosInstance
      .put(`/channel/setting/${channelid}/user`, {
        id: userid,
        status: 'ban',
      })
      .then(() => {
        onChangeBan();
      });
  };
  const kickUserHandler = async () => {
    axiosInstance.put(`/channel/setting/${channelid}/user`, {
      id: userid,
      status: 'kick',
    });
  };
  const adminUserHandler = async () => {
    axiosInstance
      .put(`/channel/setting/${channelid}/user`, {
        id: userid,
        status: 'admin',
      })
      .then((data) => {
        if (data.data.resStatus.code === '0000') onChangeAdmin();
      });
  };

  const muteUserHandler = async () => {
    axiosInstance
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
          <Toggle
            text='ban'
            color='green'
            checked={ban}
            onToggle={banUserHandler}
          />
        </div>
      </WrapperSection>
      <Button text={'kick'} color='grey' onClick={kickUserHandler} />
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
