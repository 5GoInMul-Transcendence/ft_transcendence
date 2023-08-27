'use client';

import Link from 'next/link';
import ProfileItem from '../profile/[user]/ProfileItem';
import AchievementItem from './AchievementItem';
import MatchItem from '@/component/MatchItem';
import ProfileImage from '@/component/ProfileImage';
import styled from 'styled-components';
import { IUser } from '@/types/IUser';
import useSwrFetcher from '@/hooks/useSwrFetcher';

export default function Profile() {
  const [data, status] = useSwrFetcher<IUser>('/api/me');
  const { id, nickname, avatar, gameRecord } = data
    ? data
    : {
        id: 0,
        nickname: '',
        avatar: '',
        gameRecord: { win: 0, lose: 0, ladderLevel: 0, achievement: [] },
      };

  return (
    <Container>
      <TopWrapper>
        <Wrapper $width={3}>
          <ProfileImage url={avatar} size='250px' />
        </Wrapper>
        <Wrapper $width={7}>
          <ProfileItem title='NICNAME' content={nickname} />
          <ProfileItem title='LADDER LEVEL' content={gameRecord.ladderLevel} />
          <MatchItem
            title='WIN/LOSE'
            content={`${gameRecord.win}/${gameRecord.lose}`}
          />
          <AchievementItem
            title='ACHIEVMENT'
            content={gameRecord.achievement || []}
          />
          <EditLink href='/myprofile/edit'>EDIT</EditLink>
        </Wrapper>
      </TopWrapper>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  margin: 2rem 0;
`;

const TopWrapper = styled.div`
  display: flex;
  width: 80%;
`;

const Wrapper = styled.div<{ $width: number }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: ${({ $width }) => $width};
  margin: 0 2rem;
  height: 100%;
  div {
    margin-bottom: 0.5rem;
  }
`;

const EditLink = styled(Link)`
  padding: 1rem;
  text-align: center;
  border-radius: 0.8rem;
  color: ${({ theme }) => theme.colors.black};
  background-color: ${({ theme }) => theme.colors.green};
`;
