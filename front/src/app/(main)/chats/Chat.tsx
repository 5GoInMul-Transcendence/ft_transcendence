'use client';

import { useEffect, useState } from 'react';
import useInput from '@/hooks/useInput';
import useSocket from '@/hooks/useSocket';
import ChatMessageBox from './ChatMessageBox';
import styled from 'styled-components';

export default function Chats() {
  const [socket] = useSocket('/');
  const [clientMessage, setClientMessage, onChangeClientMessage] = useInput('');
  const [clientMessageList, setClientMessageList] = useState(['']);
  const onClientMessageSubmit = (e: any) => {
    e.preventDefault();
    socket?.emit('client', clientMessage);
    setClientMessage('');
  };

  useEffect(() => {
    socket?.on('server', (message) => {
      setClientMessageList((prev) => [...prev, message.message]);
    });
  }, [socket]);

  return (
    <Container>
      <div>this is chats</div>
      <ChatMessageBox value={clientMessageList} />
      <br />
      <form onSubmit={onClientMessageSubmit}>
        <ChatInputBox
          id="text"
          value={clientMessage}
          onChange={onChangeClientMessage}
        ></ChatInputBox>
      </form>
    </Container>
  );
}

const Container = styled.div`
  width: 70%;
`;

const ChatInputBox = styled.input`
  width: 100%;
  height: 2rem;
  background-color: white;
  color: black;
  padding: 0.5rem;
`;
