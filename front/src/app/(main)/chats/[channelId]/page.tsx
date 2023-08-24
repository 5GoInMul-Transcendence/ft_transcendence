'use client';

import styled from 'styled-components';
import ChatItem from './ChatItem';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { FormEvent, useEffect, useRef, useState } from 'react';
import useInput from '@/hooks/useInput';
import axios from 'axios';
import { IChatRoom } from '@/types/IChannel';
import ChannelEdit from './ChannelEdit';

export default function Channel() {
  const { channelId } = useParams();
  const [editMode, setEditMode] = useState(false);
  const [data, setData] = useState<IChatRoom | undefined>();
  const [input, setInput, onChangeInput] = useInput('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const onExitChannel = () => {
    axios
      .delete(`/channel/${channelId}`)
      .then((data) => {
        if (data.data.resStatus.code === '0000') {
          router.push('/chats');
        }
      })
      .catch(() => {});
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    axios.post(`/channel/${channelId}/chat`, {
      message: input,
    });
    setInput('');
  };

  const onClickEdit = () => {
    if (data?.env === 'public' || data?.env === 'protected')
      setEditMode((cur) => !cur);
  };

  useEffect(() => {
    axios.get(`/api/channel/${channelId}`).then((data) => {
      if (data.data.resStatus.code === '0000') setData(data.data);
    });
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [data, editMode]);

  return (
    <Container>
      {editMode ? (
        <ChannelEdit
          channelid={data?.id || 0}
          channelName={data?.name || ''}
          role={data?.role || 'user'}
          onClickEdit={onClickEdit}
        />
      ) : (
        <>
          <ChannelNameDiv>
            <div style={{ width: '20px', height: '20px' }} />
            <button onClick={onClickEdit}>{data?.name}</button>
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
            {data?.recentMessage.map((msg) => (
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
      )}
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
