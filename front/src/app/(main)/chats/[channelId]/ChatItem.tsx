'use client';

import ProfileImage from '@/component/ProfileImage';
import Link from 'next/link';
import styled from 'styled-components';

interface ChatItemProps {
  nickname: string;
  content: string;
}

export default function ChatItem({ nickname, content }: ChatItemProps) {
  const mynick = 'jiyokim';
  //TODO: 내 정보 저장해두기
  return (
    <Container $me={mynick === nickname}>
      <Link href={`/profile/${nickname}`}>
        <ProfileImage url='' size='30px' />
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
  font-size: ${({ theme }) => theme.fontSize.xxsmall};
  margin: 0.1rem;
  * {
    margin: 0.1rem;
  }
`;

const NicknameDiv = styled.div<{ $me: boolean }>`
  text-align: ${({ $me }) => ($me ? 'right' : 'left')};
`;

const ContentDiv = styled.div`
  background-color: ${({ theme }) => theme.colors.darkgrey};
  padding: 0.4rem;
  border-radius: 5px;
`;
