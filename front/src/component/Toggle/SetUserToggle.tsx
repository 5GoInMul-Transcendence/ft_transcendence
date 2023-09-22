import useToggle from '@/hooks/useToggle';
import { IUserSetting } from '@/types/IUser';
import { axiosInstance } from '@/utils/axios';
import { modalState } from '@/utils/recoil/atom';
import { useSetRecoilState } from 'recoil';
import Toggle from '.';

interface setUserToggleProps {
  data: IUserSetting;
  channelid: string;
  userid: string;
}

export default function SetUserToggle({
  data,
  channelid,
  userid,
}: setUserToggleProps) {
  const [admin, onChangeAdmin] = useToggle(data?.admin ?? false);
  const [mute, onChangeMute] = useToggle(data?.mute ?? false);
  const [ban, onChangeBan] = useToggle(data?.ban ?? false);

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
  const adminUserHandler = async () => {
    axiosInstance
      .put(`/channel/setting/${channelid}/user`, {
        id: userid,
        status: 'admin',
      })
      .then(() => {
        onChangeAdmin();
      });
  };

  const muteUserHandler = async () => {
    axiosInstance
      .put(`/channel/setting/${channelid}/user`, {
        id: userid,
        status: 'mute',
      })
      .then(() => {
        onChangeMute();
      });
  };

  return (
    <>
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
    </>
  );
}
