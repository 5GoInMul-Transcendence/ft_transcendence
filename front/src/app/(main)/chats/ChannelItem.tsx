'use client';

import styled from 'styled-components';
import ProfileImage from '@/component/ProfileImage';
import Link from 'next/link';

export default function ChannelItem() {
  return (
    <Link href={`/chats/channel1`}>
      <Container>
        <ProfileImage url='' size='50px' />
        <ChannelDiv>
          <ChannelNameDiv>channel1</ChannelNameDiv>
          <LastChatDiv>jiyokim: lastChat</LastChatDiv>
        </ChannelDiv>
      </Container>
    </Link>
  );
}

const Container = styled.div`
  padding: 0.4rem;
  display: flex;
`;

const ChannelDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ChannelNameDiv = styled.div`
  font-size: ${({ theme }) => theme.fontSize.small};
  margin: 0.2rem 0.4rem;
`;

const LastChatDiv = styled.div`
  font-size: ${({ theme }) => theme.fontSize.xxsmall};
  margin: 0.2rem 0.4rem;
`;
