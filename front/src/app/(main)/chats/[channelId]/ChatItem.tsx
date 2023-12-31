'use client';

import ProfileImage from '@/component/ProfileImage';
import { userState } from '@/utils/recoil/atom';
import Link from 'next/link';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';

interface ChatItemProps {
  avatar: string;
  nickname: string;
  content: string;
}

export default function ChatItem({ avatar, nickname, content }: ChatItemProps) {
  const mynick = useRecoilValue(userState);
  //TODO: 내 정보 저장해두기
  return (
    <Container $me={mynick === nickname}>
      <Link href={`/profile/${nickname}`}>
        <ProfileImage url={avatar} size='30px' />
      </Link>
      <div>
        <NicknameDiv $me={mynick === nickname}>{nickname}</NicknameDiv>
        <ContentDiv>{content}</ContentDiv>
      </div>
    </Container>
  );
}

const Container = styled.div<{ $me: boolean }>`
  display: flex;
  flex-direction: ${({ $me }) => ($me ? 'row-reverse' : 'row')};
  font-size: ${({ theme }) => theme.fontSize.xsmall};
  margin: 0.1rem;
  * {
    margin: 0.1rem;
  }
`;

const NicknameDiv = styled.div<{ $me: boolean }>`
  text-align: ${({ $me }) => ($me ? 'right' : 'left')};
`;

const ContentDiv = styled.div`
  max-width: 300px;
  word-wrap: break-word; /* 긴 단어를 강제로 줄바꿈합니다. */
  overflow: hidden; /* 내용이 넘치면 숨깁니다. */
  background-color: ${({ theme }) => theme.colors.darkgrey};
  padding: 0.4rem;
  border-radius: 5px;
`;
