'use client';

import { useParams } from 'next/navigation';
import UserItem from './UserItem';
import Link from 'next/link';
import Image from 'next/image';
import styled from 'styled-components';

export default function ChannelEdit() {
  const { channelName } = useParams();
  const onClickSetting = () => {};
  return (
    <Container>
      <ChannelNameDiv>
        <div style={{ width: '18px', height: '18px' }} />
        <Link href={`/chats/${channelName}`}>{channelName}</Link>
        <button onClick={onClickSetting}>
          <Image src='/setting.svg' alt='set' width={18} height={18} />
        </button>
      </ChannelNameDiv>
      <UserItem nickname='jiyokim' role='owner' status='online' imgurl='' />
      <UserItem nickname='jiyokim' role='' status='online' imgurl='' />
    </Container>
  );
}

const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.lightgrey};
  width: 70%;
  height: 100%;
`;

const ChannelNameDiv = styled.div`
  ${({ theme }) => theme.flex.spaceBetween};
  padding: 10px;
`;
