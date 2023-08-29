'use client';

import { IFriends } from '@/types/IFriends';
import ProfileImage from '../ProfileImage';
import styled from 'styled-components';
import Link from 'next/link';
import useSwrFetcher from '@/hooks/useSwrFetcher';

export default function FriendList() {
  const friends = useSwrFetcher<IFriends[]>('/friend/list');

  if (!friends) return null;

  return (
    <div>
      {friends.map((e: IFriends, index: number) => (
        <Link key={index} href={`/profile/${e.nickname}`}>
          <FriendItem>
            <div>
              <ProfileImage url={e.avatar} size='35px' />
              &nbsp;{e.nickname}
            </div>
            <StatusDiv $status={e.status} />
          </FriendItem>
        </Link>
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
    $status === 'online'
      ? theme.colors.green
      : 'offline'
      ? theme.colors.pink
      : theme.colors.yellow};
`;
