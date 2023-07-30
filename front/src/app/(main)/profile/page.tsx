'use client';

import Toggle from '@/component/Toggle';
import Buttons from '@/component/Buttons';
import ProfileImage from '@/component/ProfileImage';
import ProfileItem from '@/app/(main)/profile/ProfileItem';
import useToggle from '@/hooks/useToggle';
import styled from 'styled-components';

export default function Profile() {
  const [follw, onChangeFollow] = useToggle(false);
  const [block, onChangeBlock] = useToggle(false);

  return (
    <Container>
      <TopWrapper>
        <Wrapper $width={3}>
          <ProfileImage url='' size='300px' />
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
          <ProfileItem title='NAME' content='jabae' />
          <ProfileItem title='MAIL' content='jabae@42seoul.com' />
          <ProfileItem title='Win/Lose' content='32/1' />
          <HistoryButton>
            <span>Game History</span>
            <span>{'>'}</span>
          </HistoryButton>
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
  margin: 10rem 20rem;
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

const HistoryButton = styled.button`
  padding: 1.5rem 2rem;
  border-radius: 0.8rem;
  color: ${({ theme }) => theme.colors.black};
  background: ${({ theme }) => theme.colors.grey};
  ${({ theme }) => theme.flex.spaceBetween};
`;
