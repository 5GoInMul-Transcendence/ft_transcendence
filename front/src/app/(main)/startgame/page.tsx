'use client';
import useSocket from '@/hooks/useSocket';
import { modalState } from '@/utils/recoil/atom';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import Loading from './loading/page';
import { GameMode } from './GameMode';
import styled from 'styled-components';

export default function StartGame() {
  const setModal = useSetRecoilState(modalState);
  const router = useRouter();
  const [socket] = useSocket('10001/main');
  const [gameMode, setGameMode] = useState<string>('');
  const [gameQueue, setGameQueue] = useState<boolean>(false);

  const onClickMatchCancel = useCallback(() => {
    setGameQueue(false);
    setGameMode('');
    socket?.emit('cancelMatch');
  }, [socket]);

  useEffect(() => {
    socket?.on('waitMatch', () => {
      setGameQueue(false);
      setGameMode('');
      setModal({ type: 'MATCH-Accept' });
    });

    socket?.on('successMatch', (res) => {
      if (res.status === true) {
        setModal(null);
        setGameMode('');
        router.push('/game');
      } else if (res.status === false) {
        setModal(null);
        setGameMode('');
        setGameQueue(true);
      }
    });
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
      <GameModeDiv> Selete Game Type : {gameMode} </GameModeDiv>
      {gameQueue && (
        <>
          <Loading />
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

const MatchCancel = styled.button``;

const GameModeDiv = styled.div`
  font-size: ${({ theme }) => theme.fontSize.large};
  margin-bottom: 1rem;
`;
