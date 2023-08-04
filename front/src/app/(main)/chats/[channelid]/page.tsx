'use client';

import styled from 'styled-components';
import ChatItem from './ChatItem';

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
  return (
    <>
      <ChannelNameDiv>
        <button>channel1</button>
      </ChannelNameDiv>
      <ChatZone>
        {chats.map((chat) => (
          <ChatItem nickname={chat.nickname} content={chat.content} />
        ))}
      </ChatZone>
      <ChatBoxDiv>
        <input />
        <button>send</button>
      </ChatBoxDiv>
    </>
  );
}

const ChannelNameDiv = styled.div`
  width: 100%;
  text-align: center;
  padding: 0.6rem;
`;

const ChatBoxDiv = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  input {
    border: solid 1px black;
    border-radius: 5px;
    color: black;
    width: 60%;
    height: 2rem;
  }
`;

const ChatZone = styled.div`
  height: calc(100% - 5rem);
  overflow-y: scroll;
`;
