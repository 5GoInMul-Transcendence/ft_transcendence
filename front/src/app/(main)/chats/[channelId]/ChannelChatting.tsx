import ChatItem from './ChatItem';
import styled from 'styled-components';
import Image from 'next/image';
import useInput from '@/hooks/useInput';
import { FormEvent, useEffect, useRef } from 'react';
import { IMessage } from '@/types/IChannel';
import { useRouter } from 'next/navigation';
import { axiosInstance } from '@/utils/axios';

interface ChannelChattingProps {
  channelId: number;
  channelName: string;
  onClickEdit: () => void;
  recentMessage: IMessage[];
}

export default function ChannelChatting({
  channelId,
  channelName,
  onClickEdit,
  recentMessage,
}: ChannelChattingProps) {
  const [input, setInput, onChangeInput] = useInput('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const onExitChannel = () => {
    axiosInstance.delete(`/channel/${channelId}`).then(() => {
      //TODO: 성공시에만 /chats로 돌아가기
      router.push('/chats');
    });
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    axiosInstance.post(`/channel/${channelId}/chat`, {
      message: input,
    });
    setInput('');
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
        {recentMessage?.map((msg) => (
          <ChatItem
            key={msg.id}
            nickname={msg.nickname}
            content={msg.content}
          />
        ))}
      </ChatZone>
      <ChatBox onSubmit={onSubmit}>
        <input value={input} onChange={onChangeInput} />
        <button type='submit'>
          <Image src='/send.svg' alt='send' width={20} height={20} />
        </button>
      </ChatBox>
    </>
  );
}

const ChannelNameDiv = styled.div`
  ${({ theme }) => theme.flex.spaceBetween}
  width: 100%;
  padding: 0.6rem;
`;

const ChatBox = styled.form`
  width: 100%;
  display: flex;
  justify-content: center;
  input {
    border: solid 1px black;
    border-radius: 5px;
    color: black;
    width: 70%;
    height: 2rem;
    margin-right: 10px;
  }
`;

const ChatZone = styled.div`
  height: calc(100% - 5rem);
  overflow-y: scroll;
`;
