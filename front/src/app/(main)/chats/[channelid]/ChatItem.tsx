'use client';

import ProfileImage from '@/component/ProfileImage';
import styled from 'styled-components';

interface ChatItemProps {
  nickname: string;
  content: string;
}

export default function ChatItem({ nickname, content }: ChatItemProps) {
  const mynick = 'jiyokim';
  return (
    <Container $me={mynick === nickname}>
      <div>
        <ProfileImage url='' size='30px' />
      </div>
      <div>
        <div>{nickname}</div>
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
const ContentDiv = styled.div`
  background-color: ${({ theme }) => theme.colors.darkgrey};
  padding: 0.4rem;
  border-radius: 5px;
`;
