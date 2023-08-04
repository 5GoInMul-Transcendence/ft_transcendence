'use client';

import Link from 'next/link';
import styled from 'styled-components';
import Pong from '@/component/Pong';
import ProfileImage from '@/component/ProfileImage';
import FriendList from '@/component/FriendList';

const name = 'kipark';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container>
      <MainContainer>
        <Pong />
        <Menubar>
          <Link href='/main'>main</Link>
          <div>
            <Link href='/startgame'>start_game</Link>
            <Link href='/chats'>chat</Link>
            <Link href='/profile'>profile</Link>
          </div>
        </Menubar>
        <ChildWrapper>{children}</ChildWrapper>
      </MainContainer>
      <SideContainer>
        <MyZone>
          <ProfileImage url='' size='45px' /> &nbsp;{name}
        </MyZone>
        <FriendZone>
          <button>+ add friend</button>
          <FriendList />
        </FriendZone>
      </SideContainer>
    </Container>
  );
}

const MyZone = styled.div`
  ${({ theme }) => theme.flex.right};
  margin: 1rem 1rem 1rem 0;
`;

const FriendZone = styled.div`
  text-align: right;
`;

const Container = styled.div`
  display: flex;
  height: 100vh;
  padding: 1rem;
`;

const MainContainer = styled.div`
  ${({ theme }) => theme.flex.centerColumn};
  width: 80%;
`;

const ChildWrapper = styled.div`
  height: calc(100% - 5rem);
  width: 100%;
`;

const SideContainer = styled.div`
  width: 20%;
  height: 100%;
`;

const Menubar = styled.div`
  ${({ theme }) => theme.flex.spaceBetween};
  width: 100%;
  a {
    margin: 1rem;
  }
`;
