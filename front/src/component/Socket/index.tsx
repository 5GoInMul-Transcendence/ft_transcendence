'use client';

import useSocket from '@/hooks/useSocket';
import { gameModeState, gameQueueState, modalState } from '@/utils/recoil/atom';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';

export default function Socket() {
  const [socket, disconnect] = useSocket('10001/main');
  const setModal = useSetRecoilState(modalState);
  const router = useRouter();
  const [, setGameMode] = useRecoilState(gameModeState);
  const [, setGameQueue] = useRecoilState(gameQueueState);

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
      socket?.on('disconnect', () => {
        disconnect();
      });
    });
  }, [socket]);

  return <></>;
}
