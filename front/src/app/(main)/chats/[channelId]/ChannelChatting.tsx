import ChatItem from './ChatItem';
import styled from 'styled-components';
import Image from 'next/image';
import useInput from '@/hooks/useInput';
import { FormEvent, useEffect, useRef } from 'react';
import { IMessage } from '@/types/IChannel';
import { useRouter } from 'next/navigation';
import { axiosInstance } from '@/utils/axios';
import ChatInput from './ChatInput';

interface ChannelChattingProps {
  channelId: number;
  channelName: string;
  recentMessage: IMessage[];
  onClickEdit: () => void;
}

export default function ChannelChatting({
  channelId,
  channelName,
  recentMessage,
  onClickEdit,
}: ChannelChattingProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const onExitChannel = () => {
    axiosInstance.delete(`/channel/${channelId}`).then(() => {
      router.push('/chats');
    });
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [recentMessage]);

  return (
    <>
      <ChannelNameDiv>
        <div style={{ width: '20px', height: '20px' }} />
        <button onClick={onClickEdit}>{channelName}</button>
        <button onClick={onExitChannel}>
          <Image
            src='/right-from-bracket-solid.svg'
            alt='exit'
            width={20}
            height={20}
          />
        </button>
      </ChannelNameDiv>
      <ChatZone ref={scrollRef}>
        {recentMessage?.map((msg, index) => (
          <ChatItem
            key={`${channelId}${index}`}
            avatar={msg.avatar}
            nickname={msg.nickname}
            content={msg.content}
          />
        ))}
      </ChatZone>
      <ChatInput channelId={channelId} />
    </>
  );
}

const ChannelNameDiv = styled.div`
  ${({ theme }) => theme.flex.spaceBetween}
  width: 100%;
  padding: 0.6rem;
`;

const ChatZone = styled.div`
  height: calc(100% - 5rem);
  overflow-y: scroll;
`;
