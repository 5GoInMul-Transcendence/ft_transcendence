'use client';

import ProfileImage from '@/component/ProfileImage';
import GameInvite from '@/component/Socket/GameInvite';
import useSocket from '@/hooks/useSocket';
import Link from 'next/link';
import styled from 'styled-components';

interface UserItemProps {
  id: number;
  nickname: string;
  role: string;
  avatar: string;
  onClickSetUser: (userid: number, nickname: string) => void;
}

export default function UserItem({
  id,
  nickname,
  role,
  avatar,
  onClickSetUser,
}: UserItemProps) {
  return (
    <Container>
      <ProfileContainer>
        <ProfileImage url={avatar} size='50px' />
        <NicknameWrapper>
          <span>{nickname}</span>
          <span>{role !== 'user' && role}</span>
        </NicknameWrapper>
      </ProfileContainer>
      <StatusContainer>
        <ProfileLink href={`/profile/${nickname}`}>profile</ProfileLink>
        <GameMatchButton>
          <GameInvite content='game' userId={id} />
        </GameMatchButton>
        <button onClick={() => onClickSetUser(id, nickname)}>{'>'}</button>
      </StatusContainer>
    </Container>
  );
}

const Container = styled.div`
  ${({ theme }) => theme.flex.spaceBetween};
  font-size: ${({ theme }) => theme.fontSize.small};
  background-color: ${({ theme }) => theme.colors.grey};
  border-radius: 10px;
  padding: 0.4rem 0.8rem;
  margin: 0.4rem 0.6rem;
`;

const StatusContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: ${({ theme }) => theme.colors.black};
  font-size: ${({ theme }) => theme.fontSize.xsmall};
`;

const NicknameWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10px;
  :last-child {
    color: ${({ theme }) => theme.colors.lightgrey};
    font-size: ${({ theme }) => theme.fontSize.xsmall};
  }
`;

const ProfileContainer = styled.div`
  display: flex;
`;

const ProfileLink = styled(Link)`
  ${({ theme }) => theme.flex.center};
  background-color: ${({ theme }) => theme.colors.white};
  width: 6rem;
  height: 2rem;
  border-radius: 10px;
`;

const GameMatchButton = styled.button`
  ${({ theme }) => theme.flex.center};
  background-color: ${({ theme }) => theme.colors.green};
  width: 6rem;
  height: 2rem;
  border-radius: 10px;
`;
