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
    <MatchWrapper>
      <div>{title}</div>
      <div>
        <Match>{content}</Match>
        <MatchHistory>
          <Link href={`${path}/history`}>
            <span>{`HISTORY >`}</span>
          </Link>
        </MatchHistory>
      </div>
    </MatchWrapper>
  );
}

const MatchWrapper = styled.div`
  div:first-child {
    margin-bottom: 1rem;
  }
  div:last-child {
    ${({ theme }) => theme.flex.spaceBetween};
  }
`;

const Match = styled.span`
  width: 45%;
  padding: 1.5rem 2rem;
  border-radius: 0.8rem;
  color: ${({ theme }) => theme.colors.black};
  background: ${({ theme }) => theme.colors.lightgrey};
`;

const MatchHistory = styled.span`
  width: 45%;
  padding: 1.5rem 2rem;
  border-radius: 0.8rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.black};
  background: ${({ theme }) => theme.colors.white};
`;
