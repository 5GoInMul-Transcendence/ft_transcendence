'use client';

import AchievementItem from './AchievementItem';
import ProfileItem from './ProfileItem';
import Buttons from '@/component/Buttons';
import MatchItem from '@/component/MatchItem';
import ProfileImage from '@/component/ProfileImage';
import Toggle from '@/component/Toggle';
import useToggle from '@/hooks/useToggle';
import styled from 'styled-components';

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
