'use client';

import AchievementItem from './AchievementItem';
import Buttons from '@/component/Buttons';
import MatchItem from './MatchItem';
import ProfileImage from '@/component/ProfileImage';
import Toggle from '@/component/Toggle';
import styled from 'styled-components';
import useToggle from '@/hooks/useToggle';
import ProfileItem from './ProfileItem';

export default function Profile({ params }: { params: { user: string } }) {
  const [follw, onChangeFollow] = useToggle(false);
  const [block, onChangeBlock] = useToggle(false);

  return (
    <Container>
      <TopWrapper>
        <Wrapper $width={3}>
          <ProfileImage url='' size='250px' />
          <TogglesWrapper>
            <Toggle
              text='follow'
              color='green'
              checked={follw}
              onToggle={onChangeFollow}
            />
            <Toggle
              text='block'
              color='pink'
              checked={block}
              onToggle={onChangeBlock}
            />
          </TogglesWrapper>
        </Wrapper>
        <Wrapper $width={7}>
          <ProfileItem title='NICNAME' content={`${params.user}`} />
          <ProfileItem title='LADDER LEVEL' content='1' />
          <MatchItem title='WIN/LOSE' content='132/13' />
          <AchievementItem
            title='ACHIEVMENT'
            content={['10연승', '10연패..']}
          />
        </Wrapper>
      </TopWrapper>
      <Buttons
        button={{ width: '20rem' }}
        leftButton={{ text: 'direct message', color: 'white' }}
        rightButton={{ text: 'match game', color: 'green' }}
      />
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
`;

const TogglesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 2rem auto;
  width: 13rem;
  height: 100%;
`;
