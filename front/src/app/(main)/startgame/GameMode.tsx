import { theme } from '@/styles/theme';
import { Dispatch, SetStateAction, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import styled from 'styled-components';

interface Props {
  gameType: string;
  gameQueue: boolean;
  setGameQueue: Dispatch<SetStateAction<boolean>>;
  setGameType: Dispatch<SetStateAction<string>>;
  socket: Socket<any, any> | undefined;
}

export function GameMode({
  gameType,
  gameQueue,
  setGameQueue,
  setGameType,
  socket,
}: Props) {
  const onClickTypeClassic = useCallback(() => {
    if (gameQueue === true) {
      return;
    }
    setGameType('CLASSIC!');
    setGameQueue(true);
    emitSubmitMatch('classic');
  }, [gameType, gameQueue]);

  const onClickTypeShotrPaddle = useCallback(() => {
    if (gameQueue === true) {
      return;
    }
    setGameType('SHORT PADDLE!');
    setGameQueue(true);
    emitSubmitMatch('paddle');
  }, [gameType, gameQueue]);

  const onClickTypeSpeedUp = useCallback(() => {
    if (gameQueue === true) {
      return;
    }
    setGameType('SPEED UP!');
    setGameQueue(true);
    emitSubmitMatch('speed');
  }, [gameType, gameQueue]);

  const emitSubmitMatch = (type: string) => {
    socket?.emit('submitMatch', {
      gametype: type,
    });
  };

  return (
    <div>
      <div>
        <GameModeButton $color={theme.colors.blue} onClick={onClickTypeClassic}>
          1. CLASSIC PONG
        </GameModeButton>
      </div>
      <div>
        <GameModeButton
          $color={theme.colors.green}
          onClick={onClickTypeShotrPaddle}
        >
          2. SHORT PADDLE
        </GameModeButton>
      </div>
      <div>
        <GameModeButton $color={theme.colors.pink} onClick={onClickTypeSpeedUp}>
          3. SPEED UP
        </GameModeButton>
      </div>
    </div>
  );
}

const GameModeButton = styled.button<{ $color: string }>`
  &:hover {
    font-size: ${({ theme }) => theme.fontSize.xxxxlarge};
    margin: 1rem 0 1rem 0;
  }
  margin: 1rem 0 0 0;

  color: ${({ $color }) => $color};
  font-size: ${({ theme }) => theme.fontSize.xxxlarge};
`;
