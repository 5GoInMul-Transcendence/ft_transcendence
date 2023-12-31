'use client';

import { IFriends } from '@/types/IFriends';
import ProfileImage from '../ProfileImage';
import styled from 'styled-components';
import Link from 'next/link';
import useSocket from '@/hooks/useSocket';
import { useEffect } from 'react';
import { axiosInstance } from '@/utils/axios';
import { useRecoilState } from 'recoil';
import { friendListState } from '@/utils/recoil/atom';

export default function FriendList() {
  const [friends, setFriends] = useRecoilState(friendListState);

  const [socket] = useSocket('10001/main');

  useEffect(() => {
    socket?.on('friend_update', (res: any) => {
      setFriends((cur) => {
        const updatedFriends = cur.map((element) => {
          if (element.id === res.data.id) {
            return {
              ...element,
              nickname:
                res.data.nickname === undefined
                  ? element.nickname
                  : res.data.nickname,
              status:
                res.data.status === undefined
                  ? element.status
                  : res.data.status,
            };
          }
          return element;
        });
        return updatedFriends;
      });
    });
  }, [socket]);

  useEffect(() => {
    axiosInstance.get('/friend/list').then((res) => {
      setFriends(res.data.data);
    });
  }, []);

  return (
    <div>
      {friends?.map((friend: IFriends) => (
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

const StatusDiv = styled.div<{ $status: string }>`
  width: 10px;
  height: 10px;
  border-radius: 100%;
  background-color: ${({ $status, theme }) =>
    $status === 'ingame'
      ? theme.colors.yellow
      : $status === 'online'
      ? theme.colors.green
      : $status === 'offline'
      ? theme.colors.pink
      : theme.colors.pink};
`;
