import styled from 'styled-components';

interface Props {
  title: string;
  content: string | number | undefined;
}

export default function ProfileItem({ title, content }: Props) {
  return (
    <Wrapper>
      <div>{title}</div>
      <div>{content}</div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  div:first-child {
    margin-bottom: 1rem;
  }

  div:last-child {
    display: flex;
    align-items: center;
    height: 4rem;
    padding: 0 2rem;
    border-radius: 0.8rem;
    color: ${({ theme }) => theme.colors.black};
    background: ${({ theme }) => theme.colors.lightgrey};
  }
  margin-bottom: 1rem;
`;
