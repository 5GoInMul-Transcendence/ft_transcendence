import ProfileImage from '@/component/ProfileImage';
import { IMatch } from '@/types/IMatch';
import styled from 'styled-components';

export function ScoreBoard({
  user1,
  user1Image,
  score1,
  user2,
  user2Image,
  score2,
}: IMatch) {
  return (
    <Container>
      <Wrapper>
        <LeftImage>
          <ProfileImage url={user1Image} size='60px' />
          <span>{user1}</span>
        </LeftImage>
        <div>
          <span>{score1}</span> vs <span>{score2}</span>
        </div>
        <RightImage>
          <span>{user2}</span>
          <ProfileImage url={user2Image} size='60px' />
        </RightImage>
      </Wrapper>
    </Container>
  );
}

const Container = styled.div`
  text-align: center;
`;

const Wrapper = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 5fr 1fr 5fr;
`;

const LeftImage = styled.div`
  ${({ theme }) => theme.flex.center}
  span {
    padding-left: 1rem;
  }
  justify-content: left;
`;

const RightImage = styled.div`
  ${({ theme }) => theme.flex.center}
  span {
    padding-right: 1rem;
  }
  justify-content: right;
`;
