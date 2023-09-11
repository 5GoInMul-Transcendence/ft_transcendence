'use client';

import styled from 'styled-components';
import { IGame } from '@/types/IGame';
import Board from './Board';
import { useEffect, useState } from 'react';
import { axiosInstance } from '@/utils/axios';
import useSocket from '@/hooks/useSocket';

export default function Game() {
  const [game, setGame] = useState<IGame | undefined>(undefined);
  // const socket = useSocket('10001/main');
  useEffect(() => {
    axiosInstance.get('/game').then((res) => {
      setGame(res.data.data);
    });
  }, []);

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
