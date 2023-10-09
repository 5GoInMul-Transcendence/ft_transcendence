'use client';

import styled from 'styled-components';
import ProfileImage from '@/component/ProfileImage';
import { useRouter } from 'next/navigation';
import { useSetRecoilState, useRecoilState } from 'recoil';
import { modalState, invalidMsgState } from '@/utils/recoil/atom';
import { IMessage } from '@/types/IChannel';
import { axiosInstance } from '@/utils/axios';
import { truncateString } from '@/utils/truncateString';

interface ChannelItemProps {
  channelId: number;
  channelName: string;
  recentMessage?: IMessage;
}

export default function ChannelItem({
  channelId,
  channelName,
  recentMessage,
}: ChannelItemProps) {
  const router = useRouter();
  const setModal = useSetRecoilState(modalState);
  const [, setInvalidMsg] = useRecoilState(invalidMsgState);

  const onClickChannel = () => {
    if (recentMessage) {
      router.push(`/chats/${channelId}`);
      return;
    }
    axiosInstance.get(`/channel/${channelId}/check`).then((data) => {
      if (data.data.data.isBan === true) {
        setModal({ type: 'API-Error' });
        setInvalidMsg('방에 입장할 수 없습니다!');
        return;
      }
      if (data.data.data.mode === 'protected') {
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
      <ProfileImage url={recentMessage?.avatar ?? ''} size='50px' />
      <ChannelDiv>
        <ChannelNameDiv>{truncateString(channelName, 12)}</ChannelNameDiv>
        <LastChatDiv>
          {recentMessage.nickname +
            (recentMessage.id !== -1 ? ':' : '') +
            recentMessage.content}
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
  font-size: ${({ theme }) => theme.fontSize.normal};
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0.2rem 0.4rem;
`;

const LastChatDiv = styled.div`
  font-size: ${({ theme }) => theme.fontSize.xsmall};
  margin: 0.2rem 0.4rem;
`;
