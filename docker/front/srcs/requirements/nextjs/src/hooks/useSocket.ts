import { useCallback } from 'react';
import { Socket, io } from 'socket.io-client';

const backUrl = 'ws://localhost:8080';

const sockets: { [key: string]: Socket } = {};
const useSocket = (workspace?: string): [Socket | undefined, () => void] => {
  const disconnect = useCallback(() => {
    if (workspace) {
      sockets[workspace].disconnect();
      delete sockets[workspace];
    }
  }, [workspace]);
  if (!workspace) {
    return [undefined, disconnect];
  }
  if (!sockets[workspace]) {
    sockets[workspace] = io(`${backUrl}/`, {
      transports: ['websocket'],
    });
  }

  return [sockets[workspace], disconnect];
};

export default useSocket;
