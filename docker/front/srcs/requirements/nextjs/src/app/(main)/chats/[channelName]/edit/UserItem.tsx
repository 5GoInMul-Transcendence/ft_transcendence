'use client';

import ProfileImage from '@/component/ProfileImage';
import styled from 'styled-components';

interface UserItemProps {
  nickname: string;
  role: string;
  status: string;
  imgurl: string;
}

export default function UserItem({
  nickname,
  role,
  status,
  imgurl,
}: UserItemProps) {
  return (
    <Container>
      <ProfileContainer>
        <ProfileImage url={imgurl} size='50px' />
        <NicknameWrapper>
          <span>{nickname}</span>
          <span>{role}</span>
        </NicknameWrapper>
      </ProfileContainer>
      <StatusContainer>
        <span>
          <StatusDiv $status={status} /> {status}
        </span>
        {'>'}
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

const StatusDiv = styled.div<{ $status: string }>`
  width: 10px;
  height: 10px;
  border-radius: 100%;
  background-color: ${({ $status, theme }) =>
    $status === 'online'
      ? theme.colors.green
      : 'offline'
      ? theme.colors.pink
      : theme.colors.yellow};
`;

const StatusContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  span {
    display: flex;
    align-items: center;
    gap: 2px;
  }
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
