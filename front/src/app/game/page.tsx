'use client';

import { ScoreBoard } from './ScoreBoard';
import GameBoard from './GameBoard';
import styled from 'styled-components';
import useSwrFetcher from '@/hooks/useSwrFetcher';
import { IGame } from '@/types/IGame';
import { IUser } from '@/types/IUser';
import Board from './Board';

export default function Game() {
  const game = useSwrFetcher<IGame>('/game');
  // const me = useSwrFetcher<IUser>('/me');

  if (!game) return;

  return (
    <Container>
      <Board game={game} />
    </Container>
  );
}

const Container = styled.div`
  height: 100%;
`;
