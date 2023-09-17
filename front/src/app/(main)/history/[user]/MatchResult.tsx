import ProfileImage from '@/component/ProfileImage';
import styled from 'styled-components';
interface Props {
  createdDate: string;
  player1Nickname: string;
  player1Avatar: string;
  player1Score: number;
  player2Nickname: string;
  player2Avatar: string;
  player2Score: number;
}
export function MatchResult({
  createdDate,
  player1Nickname,
  player1Avatar,
  player1Score,
  player2Nickname,
  player2Avatar,
  player2Score,
}: Props) {
  return (
    <Container>
      <Date>{createdDate}</Date>
      <Wrapper>
        <LeftImage>
          <ProfileImage url={player1Avatar} size='60px' />
          <span>{player1Nickname}</span>
        </LeftImage>
        <div>
          <span>{player1Score}</span> vs <span>{player2Score}</span>
        </div>
        <RightImage>
          <span>{player2Nickname}</span>
          <ProfileImage url={player2Avatar} size='60px' />
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
