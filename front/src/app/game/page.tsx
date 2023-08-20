'use client';
import fetcher from '@/utils/fetcher';
import styled from 'styled-components';
import useSwr from 'swr';
import { ScoreBoard } from './ScoreBoard';
import { GameBoard } from './GameBoard';

export default function Game() {
  const { data: match, error } = useSwr('/api/match', fetcher);

  return (
    <Container>
      <ScoreBoardDiv>
        <ScoreBoard
          key={1}
          gameid={551}
          user1={'jiyo'}
          user1Image={''}
          score1={1}
          user2={'jabae'}
          user2Image={''}
          score2={2}
        ></ScoreBoard>
      </ScoreBoardDiv>
      <GameBoardDiv>
        <GameBoard></GameBoard>
      </GameBoardDiv>
    </Container>
  );
}

const Container = styled.div`
  height: 100%;
`;

const ScoreBoardDiv = styled.div`
  ${({ theme }) => theme.flex.center}
  height: 15%;
`;

const GameBoardDiv = styled.div`
  height: 85%;
`;
