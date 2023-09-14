'use client';

import { IFriends } from '@/types/IFriends';
import ProfileImage from '../ProfileImage';
import styled from 'styled-components';
import Link from 'next/link';
import useSwrFetcher from '@/hooks/useSwrFetcher';
import useSocket from '@/hooks/useSocket';
import { useEffect, useState } from 'react';

export default function FriendList() {
  const [friends, setFriends] = useState<IFriends[]>([]);
  const friendsData = useSwrFetcher<IFriends[]>('/friend/list');

  const [socket] = useSocket('10001/main');
  useEffect(() => {
    socket?.on('friend_update', (res: any) => {
      console.log(res, 'friends_update');
      setFriends((cur) => {
        cur.forEach((element) => {
          if (element.id === res.data.id) {
            element.nickname =
              res.data.nickname === undefined
                ? element.nickname
                : res.data.nickname;
            element.status =
              res.data.status === undefined ? element.status : res.data.status;
          }
        });
        return [...cur];
      });
    });
  }, [socket]);

  useEffect(() => {
    setFriends(friendsData || []);
    console.log(friendsData, 'friendsData updatae');
  }, [friendsData]);

  if (!friends) return null;

  return (
    <div>
      {friends.map((friend: IFriends) => (
        <Link key={friend.id} href={`/profile/${friend.nickname}`}>
          <FriendItem>
            <div>
              <ProfileImage url={friend.avatar} size='35px' />
              &nbsp;{friend.nickname}
            </div>
            <StatusDiv $status={friend.status} />
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

// todo : ingame
const StatusDiv = styled.div<{ $status: string }>`
  width: 10px;
  height: 10px;
  border-radius: 100%;
  background-color: ${({ $status, theme }) =>
    $status === 'ingame'
      ? theme.colors.yellow
      : 'online'
      ? theme.colors.green
      : 'offline'
      ? theme.colors.pink
      : theme.colors.pink};
`;
