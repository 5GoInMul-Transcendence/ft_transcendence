import styled from 'styled-components';

interface Props {
  title: string;
  content: string[];
}

export default function AchievementItem({ title, content }: Props) {
  return (
    <Wrapper>
      <div>{title}</div>
      <div>
        {content.map((data) => (
          <Achievement
            key={data}
            src={`http://${process.env.NEXT_PUBLIC_BACK_SERVER}:${process.env.NEXT_PUBLIC_BACK_MAIN_PORT}/achievement/${data}`}
            alt={'url'}
            width={50}
            height={50}
          />
        ))}
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  div:first-child {
    margin-bottom: 1rem;
  }
  div:last-child {
  }
`;

const Achievement = styled.img`
  padding: 0.5rem;
  margin-right: 1rem;
  border-radius: 0.8rem;
  color: ${({ theme }) => theme.colors.black};
  background: ${({ theme }) => theme.colors.white};
  border-radius: 0.8rem;
`;
