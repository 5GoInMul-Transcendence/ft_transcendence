'use client';

import styled from 'styled-components';
import PingPongAnimation from '@/component/PingPongAnimation';
import Pong from '@/component/Pong';
import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <Container>
      <Wrapper>
        <Pong />
        <PingPongAnimation />
      </Wrapper>
      <Wrapper>{children}</Wrapper>
    </Container>
  );
}

const Container = styled.div`
  ${({ theme }) => theme.flex.center};
  height: 100%;
  width: 100%;
  flex-wrap: wrap;
  gap: 0 3rem;
`;

const Wrapper = styled.div`
  width: 30rem;
  ${({ theme }) => theme.flex.centerColumn};
`;
