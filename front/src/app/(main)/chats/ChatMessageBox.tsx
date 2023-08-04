import styled from 'styled-components';

interface Props {
  value: string[];
}

export default function ChatMessageBox({ value }: Props) {
  return (
    <div>
      {value.map((val, index) => (
        <Message key={index}>{val}</Message>
      ))}
    </div>
  );
}

const Message = styled.div`
  margin: 0.5rem;
`;
