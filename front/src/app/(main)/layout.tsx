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
    <Wrapper>
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
        {children}
      </MainContainer>
      <SideContainer>
        <MyZone>
          <ProfileImage url='' size='45px' /> &nbsp;{name}
        </MyZone>
        <FriendsZone>
          <button>+ add friend</button>
          <FriendList />
        </FriendsZone>
      </SideContainer>
    </Wrapper>
  );
}

const MyZone = styled.div`
  margin-top: 1rem;
  margin-bottom: 1rem;
  margin-right: 1rem;
  ${({ theme }) => theme.flex.right};
`;

const FriendsZone = styled.div`
  text-align: right;
`;

const Wrapper = styled.div`
  display: flex;
  padding: 1rem;
`;

const MainContainer = styled.div`
  width: 80%;
`;

const SideContainer = styled.div`
  width: 20%;
  height: 100vh;
`;

const Menubar = styled.div`
  ${({ theme }) => theme.flex.spaceBetween};
  width: 100%;
  a {
    margin: 1rem;
  }
`;
