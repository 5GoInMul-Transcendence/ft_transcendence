'use client';

import { IChatUser } from '@/types/IChannel';
import UserItem from './UserItem';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

interface ChannelEditProps {
  channelid: number;
  channelName: string;
  role: string;
  onClickEdit: () => void;
}

export default function ChannelEdit({
  channelid,
  channelName,
  role,
  onClickEdit,
}: ChannelEditProps) {
  const onClickSetting = () => {};
  const [userList, setUserList] = useState<IChatUser[]>([]);
  useEffect(() => {
    axios.get(`/api/channel/setting/${channelid}`).then((data) => {
      setUserList([...data.data.data]);
    });
  }, []);
  useEffect(() => {
    console.log(userList);
  }, [userList]);
  return (
    <>
      <ChannelNameDiv>
        <div style={{ width: '18px', height: '18px' }} />
        <button onClick={onClickEdit}>{channelName}</button>
        {role === 'owner' ? (
          <button onClick={onClickSetting}>
            <Image src='/setting.svg' alt='set' width={18} height={18} />
          </button>
        ) : (
          <div />
        )}
      </ChannelNameDiv>
      {userList?.map((user) => (
        <UserItem
          key={user.id}
          nickname={user.nickname}
          role={user.role}
          avatar={user.avatar}
        />
      ))}
    </>
  );
}

const ChannelNameDiv = styled.div`
  ${({ theme }) => theme.flex.spaceBetween};
  padding: 10px;
`;
