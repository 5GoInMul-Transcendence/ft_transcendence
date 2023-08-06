'use client';

import { IFriends } from '@/types/IFriends';
import ProfileImage from '../ProfileImage';
import fetcher from '@/utils/fetcher';
import styled from 'styled-components';
import useSwr from 'swr';

export default function FriendList() {
  const { data: friends, error } = useSwr('/api/friends', fetcher);

  if (!friends) return null;

  return (
    <div>
      {friends.map((e: IFriends, index: number) => (
        <FriendItem key={index}>
          <div>
            <ProfileImage url={e.url} size="35px" />
            &nbsp;{e.name}
          </div>
          <StatusDiv $status={e.status} />
        </FriendItem>
      ))}
    </div>
  );
}

const FriendItem = styled.div`
  ${({ theme }) => theme.flex.spaceBetween};
  margin: 0.4rem;
  font-size: ${({ theme }) => theme.fontSize.xsmall};
  div {
    ${({ theme }) => theme.flex.center};
  }
`;

const StatusDiv = styled.div<{ $status: string }>`
  width: 10px;
  height: 10px;
  border-radius: 100%;
  background-color: ${({ $status, theme }) =>
    $status === 'online' ? theme.colors.green : theme.colors.pink};
`;
