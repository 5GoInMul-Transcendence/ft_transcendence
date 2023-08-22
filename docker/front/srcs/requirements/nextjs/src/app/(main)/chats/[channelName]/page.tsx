'use client';

import styled from 'styled-components';
import ChatItem from './ChatItem';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FormEvent, useEffect, useRef } from 'react';
import useInput from '@/hooks/useInput';

const chats = [
  { nickname: 'jiyokim', content: 'hello~', createdAt: '20230728' },
  { nickname: 'jiyokim', content: 'hi~', createdAt: '20230728' },
  { nickname: 'kipark', content: 'hello~', createdAt: '20230728' },
  { nickname: 'jayoon', content: 'hello~', createdAt: '20230728' },
  { nickname: 'donghyuk', content: 'hello~', createdAt: '20230728' },
  { nickname: 'jabae', content: 'hello~', createdAt: '20230728' },
  { nickname: 'jiyokim', content: 'haheaf~', createdAt: '20230728' },
  { nickname: 'donghyuk', content: 'ehflwijfwlie', createdAt: '20230728' },
  { nickname: 'jiyokim', content: '아ㄴㄴ여영ㅇ~', createdAt: '20230728' },
  {
    nickname: 'jiyokim',
    content: '헤헤헤헤ㅔ 꿀ㅐㅁ~하하하하하',
    createdAt: '20230728',
  },
  { nickname: 'kipark', content: '핑퐁핑퐁 화이팅~~', createdAt: '20230728' },
  { nickname: 'jayoon', content: 'hahaha~', createdAt: '20230728' },
  { nickname: 'jiyokim', content: 'hahaha~', createdAt: '20230728' },
  { nickname: 'jiyokim', content: '뭐라뭐라~', createdAt: '20230728' },
  { nickname: 'jiyokim', content: '어쩌구저쩌구~', createdAt: '20230728' },
  { nickname: 'jiyokim', content: '어쩌구저쩌구~', createdAt: '20230728' },
  { nickname: 'jiyokim', content: '어쩌구저쩌구~', createdAt: '20230728' },
];

export default function Channel() {
  const { channelName } = useParams();
  const [input, setInput, onChangeInput] = useInput('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const onExitChannel = () => {};
  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {};
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setInput('');
  };
  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, []);
  return (
    <Container>
      <ChannelNameDiv>
        <div style={{ width: '20px', height: '20px' }} />
        <Link href={`/chats/${channelName}/edit`}>{channelName}</Link>
        <button onClick={onExitChannel}>
          <Image
            src='/right-from-bracket-solid.svg'
            alt='exit'
            width={20}
            height={20}
          />
        </button>
      </ChannelNameDiv>
      <ChatZone ref={scrollRef} onScroll={onScroll}>
        {chats.map((chat, i) => (
          <ChatItem key={i} nickname={chat.nickname} content={chat.content} />
        ))}
      </ChatZone>
      <ChatBox onSubmit={onSubmit}>
        <input value={input} onChange={onChangeInput} />
        <button type='submit'>
          <Image src='/send.svg' alt='send' width={20} height={20} />
        </button>
      </ChatBox>
    </Container>
  );
}

const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.lightgrey};
  height: 100%;
  width: 70%;
`;

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
