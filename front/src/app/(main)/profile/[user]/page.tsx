'use client';

import AchievementItem from './AchievementItem';
import ProfileItem from './ProfileItem';
import Buttons from '@/component/Buttons';
import MatchItem from '@/component/MatchItem';
import ProfileImage from '@/component/ProfileImage';
import Toggle from '@/component/Toggle';
import useSocket from '@/hooks/useSocket';
import useSwrFetcher from '@/hooks/useSwrFetcher';
import { IUserFriedns } from '@/types/IUser';
import { axiosInstance } from '@/utils/axios';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';

export default function Profile({ params }: { params: { user: string } }) {
  const [socket] = useSocket('10001/main');
  const user = params.user;
  const data = useSwrFetcher<IUserFriedns>(`user/${user}`);
  const router = useRouter();

  const onClickTogle = () => {};
  const onMatch = () => {
    socket?.emit('inviteMatch', {
      inviteUserId: data.id,
    });
  };

  const onClickDM = () => {
    axiosInstance
      .post('/channel/dm', { invitedUserId: data.id })
      .then((data) => {
        router.push(`/chats/${data.data.data.id}`);
      });
  };

  return (
    <Container>
      <TopWrapper>
        <Wrapper $width={3}>
          <ProfileImage url={data?.avatar} size='250px' />
          <TogglesWrapper>
            <Toggle
              text='follow'
              color='green'
              checked={data?.isFriend}
              onToggle={onClickTogle}
            />
            <Toggle
              text='block'
              color='pink'
              checked={data?.isBlock}
              onToggle={onClickTogle}
            />
          </TogglesWrapper>
        </Wrapper>
        <Wrapper $width={7}>
          <ProfileItem title='NICNAME' content={`${data?.nickname}`} />
          <ProfileItem
            title='LADDER LEVEL'
            content={`${data?.gameRecord.ladderLevel}`}
          />
          <MatchItem
            title='WIN/LOSE'
            content={`${data?.gameRecord.win}/${data?.gameRecord.lose}`}
            nickname={user}
          />
          <AchievementItem
            title='ACHIEVMENT'
            content={data?.gameRecord.achievement || []}
          />
        </Wrapper>
      </TopWrapper>
      <Buttons
        button={{ width: '20rem' }}
        leftButton={{
          text: 'direct message',
          color: 'white',
          onClick: onClickDM,
        }}
        rightButton={{ text: 'match game', color: 'green', onClick: onMatch }}
      />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 2rem 0;
  width: 100%;
  height: 100%;
  margin: 2rem 0;
`;

const TopWrapper = styled.div`
  ${({ theme }) => theme.flex.center};
  width: 80%;
  height: 28rem;
  margin-bottom: 4rem;
`;

const Wrapper = styled.div<{ $width: number }>`
  flex: ${({ $width }) => $width};
  margin: 0 2rem;
  height: 100%;
`;

const TogglesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 2rem auto;
  width: 13rem;
  height: 100%;
`;
