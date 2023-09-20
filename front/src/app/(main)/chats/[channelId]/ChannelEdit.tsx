'use client';

import { IChatUser } from '@/types/IChannel';
import UserItem from './UserItem';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSetRecoilState } from 'recoil';
import { modalState } from '@/utils/recoil/atom';
import { axiosInstance } from '@/utils/axios';

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
  const [userList, setUserList] = useState<IChatUser[]>([]);
  const setModal = useSetRecoilState(modalState);

  const onClickSetting = () => {
    setModal({
      type: 'SET-Channel',
      modalProps: { channelName, channelId: channelid },
    });
  };

  const onClickSetUser = (userid: number, nickname: string) => {
    if (role !== 'dm')
      setModal({
        type: 'SET-User',
        modalProps: { userid, nickname, channelid },
      });
  };

  useEffect(() => {
    axiosInstance.get(`/channel/setting/${channelid}`).then((data) => {
      setUserList([...data.data.data]);
    });
  }, []);

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
          id={user.id}
          nickname={user.nickname}
          role={user.role}
          avatar={user.avatar}
          onClickSetUser={onClickSetUser}
        />
      ))}
    </>
  );
}

const ChannelNameDiv = styled.div`
  ${({ theme }) => theme.flex.spaceBetween};
  padding: 10px;
`;
