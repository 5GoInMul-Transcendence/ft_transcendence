'use client';
import useSocket from '@/hooks/useSocket';
import { modalState } from '@/utils/recoil/atom';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import { GameMode } from './GameMode';
import Loading from './loading/page';

export default function StartGame() {
  const setModal = useSetRecoilState(modalState);
  const router = useRouter();
  const [socket] = useSocket('10001/main');
  const [gameType, setGameType] = useState<string>('');
  const [gameQueue, setGameQueue] = useState<boolean>(false);

  const onClickMatchCancel = useCallback(() => {
    setGameQueue(false);
    setGameType('');
    socket?.emit('cancelMatch');
  }, [socket]);

  useEffect(() => {
    socket?.on('waitMatch', () => {
      setGameQueue(false);
      setGameType('');
      setModal({ type: 'MATCH-Accept' });
    });

    socket?.on('successMatch', (res) => {
      if (res.status === true) {
        setModal(null);
        setGameType('');
        router.push('/game');
      } else if (res.status === false) {
        setModal(null);
        setGameType('');
        setGameQueue(true);
      }
    });
  }, [socket]);

  return (
    <Container>
      <Wrapper>
        <GameMode
          gameType={gameType}
          gameQueue={gameQueue}
          setGameQueue={setGameQueue}
          setGameType={setGameType}
          socket={socket}
        ></GameMode>
      </Wrapper>
      <GameType> Selete Game Type : {gameType} </GameType>
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

const GameType = styled.div`
  font-size: ${({ theme }) => theme.fontSize.large};
  margin-bottom: 1rem;
`;
