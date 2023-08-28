import { useCallback } from 'react';
import { Socket, io } from 'socket.io-client';

const backUrl = 'ws://localhost';

const sockets: { [key: string]: Socket } = {};
const useSocket = (port?: string): [Socket | undefined, () => void] => {
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
      extraHeaders: {
        cookie:
          'sessionid=s%3AV0Og2ue-rybWA2XW7p7WfIyT1ma0Qvd6.IEpeG3elbkI4LEPnt0Myw1CWKdm1HzDYtINuw6ha3Uo; Path=/; HttpOnly; Expires=Sun, 27 Aug 2023 07:30:32 GMT;f',
      },
    });
  }

  return [sockets[port], disconnect];
};

export default useSocket;
