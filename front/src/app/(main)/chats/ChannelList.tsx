'use client';

import { useState } from 'react';
import styled from 'styled-components';
import ChannelItem from './ChannelItem';
import { useParams } from 'next/navigation';

export default function ChannelList() {
  const { channelid } = useParams();
  const [channelOption, setChannelOption] = useState(true);
  const showAllChannels = () => {
    setChannelOption(false);
  };
  const showMyChannels = () => {
    setChannelOption(true);
  };
  return (
    <Container>
      <ChannelOptions>
        <OptionButton onClick={showAllChannels} $status={!channelOption}>
          All
        </OptionButton>
        <OptionButton onClick={showMyChannels} $status={channelOption}>
          My
        </OptionButton>
      </ChannelOptions>
      {/* {channelOption ? <div>my channels</div> : <div>all channels</div>} */}
      <ChannelItem />
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
