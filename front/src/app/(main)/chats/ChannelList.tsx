'use client';

import { useState } from 'react';
import styled from 'styled-components';
import ChannelItem from './ChannelItem';

const myChannels = [
  {
    channel_id: '11jei3',
    channel_name: 'letsplayPingPong',
    lastChat: '뭐라뭐라',
  },
];
const channels = [
  { channel_id: 'sjfie', channel_name: 'helloEveryone', lastChat: '뭐라뭐라' },
];

export default function ChannelList() {
  const [myChannelOption, setmyChannelOption] = useState(true);
  const showAllChannels = () => {
    setmyChannelOption(false);
  };
  const showMyChannels = () => {
    setmyChannelOption(true);
  };
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
            <ChannelItem key={e.channel_id} channelName={e.channel_name} />
          ))
        : channels.map((e) => (
            <ChannelItem key={e.channel_id} channelName={e.channel_name} />
          ))}
    </Container>
  );
}

const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.lightgrey};
  width: 30%;
  height: 100%;
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
