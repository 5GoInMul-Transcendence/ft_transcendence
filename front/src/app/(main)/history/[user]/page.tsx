'use client';

import { MatchResult } from './MatchResult';
import styled from 'styled-components';
import useSwrFetcher from '@/hooks/useSwrFetcher';
import { IHistory } from '@/types/IHistory';

export default function History({ params }: { params: { user: string } }) {
  const user = params.user;
  const matches = useSwrFetcher<IHistory[]>(`/game/history/${user}`);

  if (!matches) return null;

  return (
    <Container>
      <Title>{user}'s Game History</Title>
      <Wrapper>
        {matches.map((match: IHistory) => (
          <MatchResult
            key={match.gameId}
            createdTime={match.createdTime}
            player1Nickname={match.player1.nickname}
            player1Avatar={match.player1.avatar}
            player1Score={match.player1.score}
            player2Nickname={match.player2.nickname}
            player2Avatar={match.player2.avatar}
            player2Score={match.player2.score}
          />
        ))}
      </Wrapper>
    </Container>
  );
}

const Container = styled.div`
  margin: 5rem 5rem 0rem 5rem;
`;

const Title = styled.div`
  text-align: center;
  margin-bottom: 1rem;
`;

const Wrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.grey};
  position: relative;
  height: 40rem;
  &::-webkit-scrollbar {
    display: none;
  }
  overflow-y: scroll;
`;
