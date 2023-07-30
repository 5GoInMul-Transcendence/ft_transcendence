import styled from 'styled-components';

interface Props {
  title: string;
  content: string;
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
    padding: 1.5rem 2rem;
    border-radius: 0.8rem;
    color: ${({ theme }) => theme.colors.black};
    background: ${({ theme }) => theme.colors.white};
  }
`;
