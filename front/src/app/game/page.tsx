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
  const me = useSwrFetcher<IUser>('/me');

  if (!game || !me) return;

  console.log(game, me);
  return (
    <Container>
      <Board
        game={game}
        player={game.p1.nickname === me.nickname ? 'p1' : 'p2'}
      />
    </Container>
  );
}

const Container = styled.div`
  height: 100%;
`;
