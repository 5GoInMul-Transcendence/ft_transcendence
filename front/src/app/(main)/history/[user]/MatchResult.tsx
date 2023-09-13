import ProfileImage from '@/component/ProfileImage';
import { IMatch } from '@/types/IMatch';
import styled from 'styled-components';

export function MatchResult({
  user1,
  user1Image,
  score1,
  user2,
  user2Image,
  score2,
}: IMatch) {
  return (
    <Container>
      <Date>2023.06.21 14:56</Date>
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
  border: 1px solid ${({ theme }) => theme.colors.white};
  text-align: center;
`;

const Wrapper = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 3fr 1fr 3fr;
  padding: 0 1rem 1rem 1rem;
`;

const Date = styled.div`
  font-size: ${({ theme }) => theme.fontSize.xsmall};
  text-align: center;
  padding-top: 0.5rem;
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
