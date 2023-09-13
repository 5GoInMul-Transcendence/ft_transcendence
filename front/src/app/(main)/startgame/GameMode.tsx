import { theme } from '@/styles/theme';
import { Dispatch, SetStateAction, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import styled from 'styled-components';

interface Props {
  gameMode: string;
  gameQueue: boolean;
  setGameQueue: Dispatch<SetStateAction<boolean>>;
  setGameMode: Dispatch<SetStateAction<string>>;
  socket: Socket<any, any> | undefined;
}

export function GameMode({
  gameMode,
  gameQueue,
  setGameQueue,
  setGameMode,
  socket,
}: Props) {
  const onClickGameMode = useCallback(
    (gameModeText: string, gameApiText: string) => {
      if (gameQueue === true) {
        return;
      }
      setGameMode(gameModeText);
      setGameQueue(true);
      emitSubmitMatch(gameApiText);
    },
    [gameMode, gameQueue]
  );

  const emitSubmitMatch = (type: string) => {
    socket?.emit('submitMatch', {
      gameMode: type,
    });
  };

  const gameModes = [
    {
      text: '1. CLASSIC PONG',
      color: theme.colors.blue,
      gameMode: 'CLASSIC !!',
      gameApi: 'classic',
    },
    {
      text: '2. SPEED UP',
      color: theme.colors.green,
      gameMode: 'SPEED UP !!',
      gameApi: 'speed',
    },
    {
      text: '3. GOLDEN PONG',
      color: theme.colors.pink,
      gameMode: 'GOLDEN PONG !!',
      gameApi: 'goldenpong',
    },
    // Add more gameModes here
  ];

  return (
    <>
      {gameModes.map((game) => (
        <GameModeButton
          $nonSelected={gameMode === ''}
          $selected={game.gameMode === gameMode}
          $color={game.color}
          key={game.gameMode}
          onClick={() => onClickGameMode(game.gameMode, game.gameApi)}
        >
          <>
            {console.log(game.gameMode, gameMode, gameMode === game.gameMode)}
          </>
          {game.text}
        </GameModeButton>
      ))}
    </>
  );
}

const GameModeButton = styled.button<{
  $color: string;
  $selected: boolean;
  $nonSelected: boolean;
}>`
  ${({ $nonSelected }) =>
    $nonSelected
      ? `&:hover {
    font-size: ${theme.fontSize.xxxxlarge};
  }`
      : ``}
  background-color: ${({ $selected }) => ($selected ? 'blue' : '')};
  width: 100%;
  margin: 1rem 0 0 0;
  color: ${({ $color }) => $color};
  font-size: ${({ $selected, theme }) =>
    $selected ? theme.fontSize.xxxxlarge : theme.fontSize.xxxlarge};
`;
