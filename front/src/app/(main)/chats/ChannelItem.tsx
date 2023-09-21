'use client';

import styled from 'styled-components';
import ProfileImage from '@/component/ProfileImage';
import { useRouter } from 'next/navigation';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { modalState, recentMessageState } from '@/utils/recoil/atom';
import { IMessage } from '@/types/IChannel';
import { useEffect, useState } from 'react';
import { axiosInstance } from '@/utils/axios';

interface ChannelItemProps {
  channelId: number;
  channelName: string;
  recentMessage?: IMessage;
}

export default function ChannelItem({
  channelId,
  channelName,
  recentMessage,
}: ChannelItemProps) {
  const router = useRouter();
  const setModal = useSetRecoilState(modalState);
  const [msg, setMsg] = useState(recentMessage);
  const newMessage = useRecoilValue(recentMessageState);
  const onClickChannel = () => {
    if (recentMessage) {
      router.push(`/chats/${channelId}`);
      return;
    }
    axiosInstance.get(`/channel/${channelId}/check`).then((data) => {
      if (data.data.data.mode === 'protected') {
        setModal({
          type: 'ENTER-Channel',
          modalProps: { channelName, channelId },
        });
      } else {
        router.push(`/chats/${channelId}`);
      }
    });
  };
  useEffect(() => {
    if (newMessage?.id === channelId) setMsg(newMessage.recentMessage);
  }, [newMessage]);
  return (
    <Container onClick={onClickChannel}>
      <ProfileImage url='' size='50px' />
      <ChannelDiv>
        <ChannelNameDiv>{channelName}</ChannelNameDiv>
        <LastChatDiv>
          {recentMessage && msg && msg.nickname + ':'}
          {msg.content ?? ''}
        </LastChatDiv>
      </ChannelDiv>
    </Container>
  );
}

const Container = styled.div`
  padding: 0.4rem;
  display: flex;
  &:hover {
    cursor: pointer;
  }
`;

const ChannelDiv = styled.div`
  display: flex;
  width: calc(100% - 50px);
  flex-direction: column;
  justify-content: center;
`;

const ChannelNameDiv = styled.div`
  width: 100%;
  font-size: ${({ theme }) => theme.fontSize.small};
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0.2rem 0.4rem;
`;

const LastChatDiv = styled.div`
  font-size: ${({ theme }) => theme.fontSize.xxsmall};
  margin: 0.2rem 0.4rem;
`;
