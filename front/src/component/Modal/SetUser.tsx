import ProfileImage from '@/component/ProfileImage';
import Toggle from '@/component/Toggle';
import useToggle from '@/hooks/useToggle';
import styled from 'styled-components';
import useSwrFetcher from '@/hooks/useSwrFetcher';
import Button from '../Buttons/Button';
import { IUserSetting } from '@/types/IUser';
import { axiosInstance } from '@/utils/axios';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { invalidMsgState, modalState } from '@/utils/recoil/atom';
import InvalidMsg from './InvalidMsg';
import SetUserToggle from '../Toggle/SetUserToggle';

interface SetUserProps {
  userid: string;
  nickname: string;
  channelid: string;
}

export default function SetUser({ userid, nickname, channelid }: SetUserProps) {
  const data = useSwrFetcher<IUserSetting>(
    `/channel/setting/${channelid}/${userid}`
  );
  const [invalidMsg] = useRecoilState(invalidMsgState);
  const setModal = useSetRecoilState(modalState);

  const kickUserHandler = async () => {
    axiosInstance
      .put(`/channel/setting/${channelid}/user`, {
        id: userid,
        status: 'kick',
      })
      .then(() => {
        setModal(null);
      });
  };

  if (!data) return;
  return (
    <Wrapper>
      <WrapperSection>
        <div>
          <ProfileImage url='' size='150px' />
          <div>{nickname}</div>
        </div>
        <div>
          <SetUserToggle data={data} channelid={channelid} userid={userid} />
        </div>
      </WrapperSection>
      <InvalidMsg text={invalidMsg} />
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
