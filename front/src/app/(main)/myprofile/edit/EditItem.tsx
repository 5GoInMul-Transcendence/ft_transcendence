import Image from 'next/image';
import styled from 'styled-components';

interface Props {
  title: string;
  content: string;
}

export default function EditItem({ title, content }: Props) {
  return (
    <Wrapper>
      <div>{title}</div>
      <EditContentDiv>
        <span>{content}</span>
        <button>
          <Image src='/pen.svg' alt='me' width='20' height='20' />
        </button>
      </EditContentDiv>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  margin-bottom: 1rem;
  div:first-child {
    margin-bottom: 1rem;
  }
  div:last-child {
    height: 4rem;
    width: 100%;
    padding: 0 2rem;
    border-radius: 0.8rem;
    color: ${({ theme }) => theme.colors.black};
    background: ${({ theme }) => theme.colors.lightgrey};
  }
`;

const EditContentDiv = styled.div`
  ${({ theme }) => theme.flex.spaceBetween};
`;
