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
        <span>
          <Image src='/pencil.png' alt='me' width='25' height='25' />
        </span>
      </EditContentDiv>
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
    background: ${({ theme }) => theme.colors.lightgrey};
  }
`;

const EditContentDiv = styled.div`
  ${({ theme }) => theme.flex.spaceBetween};
`;
