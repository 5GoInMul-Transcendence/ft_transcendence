'use client';
import useSocket from '@/hooks/useSocket';
import { gameModeState, gameQueueState } from '@/utils/recoil/atom';
import { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { GameMode } from './GameMode';
import styled from 'styled-components';
import DotLoading from './DotLoading';

export default function StartGame() {
  const [socket] = useSocket('10001/main');
  const [gameMode, setGameMode] = useRecoilState(gameModeState);
  const [gameQueue, setGameQueue] = useRecoilState(gameQueueState);

  const onClickMatchCancel = useCallback(() => {
    setGameQueue(false);
    setGameMode('');
    socket?.emit('cancelMatch');
  }, [socket]);

  return (
    <Container>
      <Wrapper>
        <GameMode
          gameMode={gameMode}
          gameQueue={gameQueue}
          setGameQueue={setGameQueue}
          setGameMode={setGameMode}
          socket={socket}
        ></GameMode>
      </Wrapper>
      <GameModeDiv>Game Type : [ {gameMode} ] </GameModeDiv>
      {gameQueue && (
        <>
          <DotLoading />
          <MatchCancel onClick={onClickMatchCancel}>Match Cancel</MatchCancel>
        </>
      )}
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
  height: 15rem;
`;

const MatchCancel = styled.button`
  color: ${({ theme }) => theme.colors.yellow};
`;

const GameModeDiv = styled.div`
  font-size: ${({ theme }) => theme.fontSize.large};
  margin-bottom: 1rem;
`;
