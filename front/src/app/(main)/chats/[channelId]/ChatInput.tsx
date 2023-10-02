import Image from 'next/image';
import useInput from '@/hooks/useInput';
import { axiosInstance } from '@/utils/axios';
import { FormEvent } from 'react';
import styled from 'styled-components';

interface Props {
  channelId: number;
}

export default function ChatInput({ channelId }: Props) {
  const [input, setInput, onChangeInput] = useInput('');

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    axiosInstance.post(`/channel/${channelId}/chat`, {
      message: input,
    });
    setInput('');
  };

  return (
    <>
      <ChatBox onSubmit={onSubmit}>
        <input value={input} onChange={onChangeInput} maxLength={255} />
        <button type='submit'>
          <Image src='/send.svg' alt='send' width={20} height={20} />
        </button>
      </ChatBox>
    </>
  );
}

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
