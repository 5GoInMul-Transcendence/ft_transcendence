'use client';

import styled from 'styled-components';
import ProfileImage from '@/component/ProfileImage';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useSetRecoilState } from 'recoil';
import { modalState } from '@/utils/recoil/atom';

interface ChannelItemProps {
  channelId: number;
  channelName: string;
  recentMessage?: {
    nickname: string;
    message: string;
  };
}

export default function ChannelItem({
  channelId,
  channelName,
  recentMessage,
}: ChannelItemProps) {
  const router = useRouter();
  const setModal = useSetRecoilState(modalState);
  const onClickChannel = () => {
    if (recentMessage) {
      router.push(`/chats/${channelId}`);
      return;
    }
    axios.get(`/channel/${channelId}/check`).then((data) => {
      if (data.data.data.env === 'protected') {
        setModal({
          type: 'ENTER-Channel',
          modalProps: { channelName, channelId },
        });
      } else {
        router.push(`/chats/${channelId}`);
      }
    });
  };
  return (
    <Container onClick={onClickChannel}>
      <ProfileImage url='' size='50px' />
      <ChannelDiv>
        <ChannelNameDiv>{channelName}</ChannelNameDiv>
        <LastChatDiv>
          {recentMessage &&
            recentMessage.nickname + ':' + recentMessage.message}
        </LastChatDiv>
      </ChannelDiv>
    </Container>
  );
}

const Container = styled.div`
  padding: 0.4rem;
  display: flex;
  &:hover {
    cursor: pointer;
  }
`;

const ChannelDiv = styled.div`
  display: flex;
  width: calc(100% - 50px);
  flex-direction: column;
  justify-content: center;
`;

const ChannelNameDiv = styled.div`
  width: 100%;
  font-size: ${({ theme }) => theme.fontSize.small};
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0.2rem 0.4rem;
`;

const LastChatDiv = styled.div`
  font-size: ${({ theme }) => theme.fontSize.xxsmall};
  margin: 0.2rem 0.4rem;
`;
