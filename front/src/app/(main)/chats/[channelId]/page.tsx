'use client';

import styled from 'styled-components';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { IChatRoom, IMessage } from '@/types/IChannel';
import ChannelEdit from './ChannelEdit';
import ChannelChatting from './ChannelChatting';
import { useRecoilValue } from 'recoil';
import { recentMessageState } from '@/utils/recoil/atom';
import { axiosInstance } from '@/utils/axios';

export default function Channel() {
  const { channelId } = useParams();
  const newMessage = useRecoilValue(recentMessageState);
  const [editMode, setEditMode] = useState(false);
  const [data, setData] = useState<IChatRoom | undefined>();
  const [recentMessage, setRecentMessage] = useState<IMessage[]>([]);

  const onClickEdit = () => {
    if (data?.mode === 'public' || data?.mode === 'protected')
      setEditMode((cur) => !cur);
  };

  useEffect(() => {
    axiosInstance.get(`/api/channel/${channelId}`).then((data) => {
      setData(data.data);
      setRecentMessage(data.data.recentMessage);
    });
  }, []);

  useEffect(() => {
    if (newMessage && `${newMessage.id}` === channelId) {
      setRecentMessage((cur) => [...cur, newMessage.recentMessage]);
    }
  }, [newMessage]);

  return (
    <Container>
      {editMode ? (
        <ChannelEdit
          channelid={data?.id || 0}
          channelName={data?.name || ''}
          role={data?.role || 'user'}
          onClickEdit={onClickEdit}
        />
      ) : (
        <ChannelChatting
          channelId={data?.id || 0}
          channelName={data?.name || ''}
          onClickEdit={onClickEdit}
          recentMessage={recentMessage}
        />
      )}
    </Container>
  );
}

const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.lightgrey};
  height: 100%;
  width: 70%;
`;
