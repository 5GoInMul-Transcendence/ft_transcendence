import styled from 'styled-components';

interface Props {
  text: string;
}

export default function InvalidMsg({ text }: Props) {
  if (text === '') return null;
  return <InvalidMsgDiv>{text}</InvalidMsgDiv>;
}

const InvalidMsgDiv = styled.div`
  ${({ theme }) => theme.flex.center};
  margin-bottom: 2rem;
  font-size: ${({ theme }) => theme.fontSize.large};
  color: ${({ theme }) => theme.colors.pink};
`;
