'use client';

import Link from 'next/link';
import ProfileItem from '../profile/[user]/ProfileItem';
import AchievementItem from './AchievementItem';
import MatchItem from './MatchItem';
import ProfileImage from '@/component/ProfileImage';
import styled from 'styled-components';

export default function Profile() {
  return (
    <Container>
      <TopWrapper>
        <Wrapper $width={3}>
          <ProfileImage url='' size='250px' />
        </Wrapper>
        <Wrapper $width={7}>
          <ProfileItem title='NICNAME' content='jabae' />
          <ProfileItem title='LADDER LEVEL' content='1' />
          <MatchItem title='WIN/LOSE' content='132/13' />
          <AchievementItem
            title='ACHIEVMENT'
            content={['10연승', '10연패..']}
          />
          <EditButton>
            <Link href='/myprofile/edit'>EDIT</Link>
          </EditButton>
        </Wrapper>
      </TopWrapper>
    </Container>
  );
}

const Container = styled.div`
  ${({ theme }) => theme.flex.centerColumn};
  margin: 5rem 10rem;
`;

const TopWrapper = styled.div`
  ${({ theme }) => theme.flex.center};
  width: 100%;
  height: 28rem;
  margin-bottom: 10rem;
`;

const Wrapper = styled.div<{ $width: number }>`
  flex: ${({ $width }) => $width};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 0 2rem;
  height: 100%;
  div {
    margin-bottom: 0.5rem;
  }
`;

const EditButton = styled.div`
  padding: 1rem;
  text-align: center;
  border-radius: 0.8rem;
  color: ${({ theme }) => theme.colors.black};
  background-color: ${({ theme }) => theme.colors.green};
`;
