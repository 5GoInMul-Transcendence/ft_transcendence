import { useCallback } from 'react';
import { Socket, io } from 'socket.io-client';

const sockets: { [key: string]: Socket } = {};
const useGameSocket = (
  port: string,
  gameKey: string
): [Socket | undefined, () => void] => {
  const disconnect = useCallback(() => {
    if (port) {
      try {
        sockets[port].disconnect();
      } catch {}
      delete sockets[port];
    }
  }, [port]);
  if (!port) {
    return [undefined, disconnect];
  }
  if (!sockets[port]) {
    sockets[port] = io(`ws://${process.env.NEXT_PUBLIC_BACK_SERVER}:${port}`, {
      transports: ['websocket'],
      auth: {
        gameKey: gameKey,
      },
    });
  }

  return [sockets[port], disconnect];
};

export default useGameSocket;
