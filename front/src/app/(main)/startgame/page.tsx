'use client';
import { theme } from '@/styles/theme';
import styled from 'styled-components';

export default function StartGame() {
  return (
    <Container>
      <Wrapper>
        <GameMode $color={theme.colors.blue}>1. CLASSIC PONG</GameMode>
        <GameMode $color={theme.colors.green}>2. SHORT PADDLE</GameMode>
        <GameMode $color={theme.colors.pink}>3. SPEED UP</GameMode>
      </Wrapper>
      <div>WAIT . . .</div>
    </Container>
  );
}

const Container = styled.div`
  ${({ theme }) => theme.flex.center};
  flex-direction: column;
  margin: 5rem 5rem 5rem 5rem;
`;

const Wrapper = styled.div`
  width: 100%;
  height: 20rem;
`;

const GameMode = styled.button<{ $color: string }>`
  &:hover {
    font-size: ${({ theme }) => theme.fontSize.xxxxlarge};
    margin: 1rem 0 1rem 0;
  }
  color: ${({ $color }) => $color};

  font-size: ${({ theme }) => theme.fontSize.xxxlarge};
`;
