'use client';

import { useEffect, useState } from 'react';
import styled from 'styled-components';
import ChannelItem from './ChannelItem';
import axios from 'axios';
// import { Socket, io } from 'socket.io-client';
import { IAllChannel, IMyChannel } from '@/types/IChannel';

export default function ChannelList() {
  // const socket = io('ws://localhost:8080', {
  //   transports: ['websocket'],
  // });
  const [myChannelOption, setmyChannelOption] = useState(true);
  const [myChannels, setMyChannels] = useState<IMyChannel[]>([]);
  const [allChannels, setAllChannels] = useState<IAllChannel[]>([]);
  const showAllChannels = () => {
    setmyChannelOption(false);
  };
  const showMyChannels = () => {
    setmyChannelOption(true);
  };
  useEffect(() => {
    axios.get('/api/me/channels').then((data) => {
      if (data.data.resStatus.code === '0000') setMyChannels(data.data.data);
    });
    axios.get('/api/channels').then((data) => {
      if (data.data.resStatus.code === '0000') setAllChannels(data.data.data);
    });
  }, []);

  // useEffect(() => {
  //   socket.on('addAllChannel', ({ data }: { data: IAllChannel }) => {
  //     setAllChannels((cur) => [...cur, data]);
  //     console.log(data);
  //   });
  // }, [socket]);

  return (
    <Container>
      <ChannelOptions>
        <OptionButton onClick={showAllChannels} $status={!myChannelOption}>
          All
        </OptionButton>
        <OptionButton onClick={showMyChannels} $status={myChannelOption}>
          My
        </OptionButton>
      </ChannelOptions>
      {myChannelOption
        ? myChannels.map((e) => (
            <ChannelItem
              key={e.id}
              channelId={e.id}
              channelName={e.name}
              recentMessage={e.recentMessage}
            />
          ))
        : allChannels.map((e) => (
            <ChannelItem key={e.id} channelId={e.id} channelName={e.name} />
          ))}
    </Container>
  );
}

const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.lightgrey};
  width: 30%;
  height: 100%;
  overflow-y: scroll;
`;

const ChannelOptions = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 0.4rem 0;
  font-size: ${({ theme }) => theme.fontSize.xsmall};
`;

const OptionButton = styled.button<{ $status: boolean }>`
  color: ${({ $status, theme }) =>
    $status ? theme.colors.green : theme.colors.black};
`;
