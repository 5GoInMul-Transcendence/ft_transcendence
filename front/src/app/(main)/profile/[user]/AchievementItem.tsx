import gravatar from 'gravatar';
import styled from 'styled-components';

interface Props {
  title: string;
  content: string[] | null;
}

export default function AchievementItem({ title, content }: Props) {
  return (
    <Wrapper>
      <div>{title}</div>
      <div>
        {content.map((data, index) => (
          <Achievement
            key={data}
            src={gravatar.url('kipark@ki.com', {
              s: `50px`,
              d: 'retro',
            })}
            alt={'kipark'}
            style={{ borderRadius: '0.8rem' }}
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
  margin: 1rem 0;
`;

const Achievement = styled.img`
  padding: 0.5rem;
  margin-right: 1rem;
  border-radius: 0.8rem;
  color: ${({ theme }) => theme.colors.black};
  background: ${({ theme }) => theme.colors.white};
`;
