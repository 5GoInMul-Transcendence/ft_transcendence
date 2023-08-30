'use client';

import Link from 'next/link';
import Pong from '@/component/Pong';
import ProfileImage from '@/component/ProfileImage';
import FriendList from '@/component/FriendList';
import useSocket from '@/hooks/useSocket';
import useSwrFetcher from '@/hooks/useSwrFetcher';
import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { modalState } from '@/utils/recoil/atom';
import { IUser } from '@/types/IUser';
import styled from 'styled-components';

const name = 'kipark';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [socket] = useSocket('10001/main');
  const data = useSwrFetcher<IUser>('/me');
  const setModal = useSetRecoilState(modalState);

  useEffect(() => {
    socket?.on('connect', () => {
      console.log('socket connect');
      console.log(socket);
    });
  }, [socket]);

  if (!data) return;

  // console.log(data);
  // console.log(socket);
  const onClickAddFriend = () => {
    setModal({ type: 'ADD-Friend' });
  };
  return (
    <Container>
      <MainContainer>
        <Pong />
        <Menubar>
          <Link href='/main'>main</Link>
          <div>
            <Link href='/startgame'>start_game</Link>
            <Link href='/chats'>chat</Link>
            <Link href='/myprofile'>profile</Link>
          </div>
        </Menubar>
        <ChildWrapper>{children}</ChildWrapper>
      </MainContainer>
      <SideContainer>
        <Link href='/myprofile'>
          <MyProfile>
            <ProfileImage url='' size='45px' />
            &nbsp;
            {data.nickname}
          </MyProfile>
        </Link>
        <FriendProfile>
          <button onClick={onClickAddFriend}>+ add friend</button>
          <FriendList />
        </FriendProfile>
      </SideContainer>
    </Container>
  );
}

const MyProfile = styled.div`
  ${({ theme }) => theme.flex.right};
  margin: 1rem 1rem 1rem 0;
`;

const FriendProfile = styled.div`
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
