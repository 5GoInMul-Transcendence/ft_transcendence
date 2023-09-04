'use client';

import { ScoreBoard } from './ScoreBoard';
import GameBoard from './GameBoard';
import styled from 'styled-components';
import useSwrFetcher from '@/hooks/useSwrFetcher';
import { IGame } from '@/types/IGame';

export default function Game() {
  const data = useSwrFetcher<IGame>('/game');
  if (!data) return;

  console.log(data);
  return (
    <Container>
      <ScoreBoardDiv>
        <ScoreBoard
          key={1}
          gameid={123}
          user1={data.p1.nickname}
          user1Image={''}
          score1={1}
          user2={data.p2.nickname}
          user2Image={''}
          score2={2}
        ></ScoreBoard>
      </ScoreBoardDiv>
      <GameBoardDiv>
        <GameBoard gameKey={data.gameKey} />
      </GameBoardDiv>
    </Container>
  );
}

const Container = styled.div`
  height: 100%;
`;

const ScoreBoardDiv = styled.div`
  ${({ theme }) => theme.flex.center}
  height: 20%;
`;

const GameBoardDiv = styled.div`
  height: 80%;
`;
