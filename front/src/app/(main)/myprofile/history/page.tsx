'use client';

import styled from 'styled-components';
import { MatchResult } from './MatchResult';
import useSwr from 'swr';
import fetcher from '@/utils/fetcher';
import { IMatch } from '@/types/IMatch';

export default function History() {
  const { data: match, error } = useSwr('/api/match', fetcher);

  if (!match) return null;

  return (
    <Container>
      <Title>Jabae's Game History</Title>
      <Wrapper>
        {match.map((match: IMatch) => (
          <MatchResult
            user1={match.user1}
            user1Image={match.user1Image}
            score1={match.score1}
            user2={match.user2}
            user2Image={match.user2Image}
            score2={match.score2}
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
