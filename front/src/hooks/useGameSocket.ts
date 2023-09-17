import { useCallback } from 'react';
import { Socket, io } from 'socket.io-client';
const backUrl = 'ws://localhost';

const sockets: { [key: string]: Socket } = {};
const useGameSocket = (
  port: string,
  gameKey: string
): [Socket | undefined, () => void] => {
  const disconnect = useCallback(() => {
    if (port) {
      sockets[port].disconnect();
      delete sockets[port];
    }
  }, [port]);
  if (!port) {
    return [undefined, disconnect];
  }
  if (!sockets[port]) {
    sockets[port] = io(`${backUrl}:${port}`, {
      transports: ['websocket'],
      auth: {
        gameKey: gameKey,
      },
    });
  }

  return [sockets[port], disconnect];
};

export default useGameSocket;
