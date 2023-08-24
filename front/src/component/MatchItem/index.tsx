import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styled from 'styled-components';

interface Props {
  title: string;
  content: string;
}

export default function MatchItem({ title, content }: Props) {
  const path = usePathname();

  return (
    <MatchContainer>
      <div>{title}</div>
      <MatchWrapper>
        <Match>{content}</Match>
        <MatchHistory href={`${path}/history`}>{`HISTORY >`}</MatchHistory>
      </MatchWrapper>
    </MatchContainer>
  );
}

const MatchContainer = styled.div`
  width: 100%;
  div:first-child {
    margin-bottom: 1rem;
  }
`;

const MatchWrapper = styled.div`
  ${({ theme }) => theme.flex.spaceBetween};
`;

const Match = styled.span`
  ${({ theme }) => theme.flex.center};
  width: 47%;
  height: 4rem;
  border-radius: 0.8rem;
  color: ${({ theme }) => theme.colors.black};
  background: ${({ theme }) => theme.colors.lightgrey};
`;

const MatchHistory = styled(Link)`
  ${({ theme }) => theme.flex.center};
  width: 47%;
  height: 4rem;
  border-radius: 0.8rem;
  color: ${({ theme }) => theme.colors.black};
  background: ${({ theme }) => theme.colors.white};
`;
