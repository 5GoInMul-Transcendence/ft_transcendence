'use client';

import { useEffect, useState } from 'react';
import styled from 'styled-components';
import ChannelItem from './ChannelItem';
import axios from 'axios';
import { IAllChannel, IMyChannel } from '@/types/IChannel';
import useSocket from '@/hooks/useSocket';
import { useSetRecoilState } from 'recoil';
import { recentMessageState } from '@/utils/recoil/atom';
import { axiosInstance } from '@/utils/axios';

export default function ChannelList() {
  const [socket, disconnect] = useSocket('10002/chat');
  const setRecentMessage = useSetRecoilState(recentMessageState);
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
    axiosInstance.get('/channels/mine').then((data) => {
      setMyChannels(data.data.data);
    });
    axiosInstance.get('/channels').then((data) => {
      setAllChannels(data.data.data);
    });
  }, []);

  useEffect(() => {
    socket?.on('addAllChannel', ({ data }: { data: IAllChannel }) => {
      setAllChannels((cur) => [...cur, data]);
    });
    socket?.on('deleteAllChannel', ({ data }: { data: IAllChannel }) => {
      setAllChannels((cur) => cur.filter((e) => e.id !== data.id));
    });
    socket?.on('addMyChannel', ({ data }: { data: IMyChannel }) => {
      setMyChannels((cur) => [...cur, data]);
    });
    socket?.on('deleteMyChannel', ({ data }: { data: IMyChannel }) => {
      setMyChannels((cur) => cur.filter((e) => e.id !== data.id));
    });
    socket?.on('updateMyChannel', ({ data }: { data: IMyChannel }) => {
      setRecentMessage(data);
      setMyChannels((cur) => {
        cur.forEach((e) => {
          if (e.id === data.id) e = data;
        });
        return [...cur];
      });
    });
  }, [socket]);

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
        ? myChannels?.map((e) => (
            <ChannelItem
              key={e.id}
              channelId={e.id}
              channelName={e.name}
              recentMessage={e.recentMessage}
            />
          ))
        : allChannels?.map((e) => (
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
