'use client';

import styled from 'styled-components';
import ChannelList from './ChannelList';
import React from 'react';

export default function ChatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Container>
        <ChannelList />
        {children}
      </Container>
      <CreateChannelButton> + create channel</CreateChannelButton>
    </>
  );
}

const Container = styled.div`
  display: flex;
  gap: 0 1rem;
  width: 100%;
  height: calc(100% - 1.5rem);
  padding: 1rem 1rem 0 1rem;
`;

const CreateChannelButton = styled.button`
  font-size: ${({ theme }) => theme.fontSize.xsmall};
  margin-left: 1rem;
`;
