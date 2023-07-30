import styled from 'styled-components';

export interface Props {
  text: string;
  color: string;
  width?: string;
}

export default function Button({ text, color, width }: Props) {
  return (
    <WrapperButton $color={color} $width={width}>
      {text}
    </WrapperButton>
  );
}

const WrapperButton = styled.button<{ $color: string; $width?: string }>`
  ${({ theme }) => theme.flex.center};
  border-radius: 0.8rem;
  margin: 0 2rem;
  padding: 0 0.2rem;
  height: 3.5rem;
  width: ${({ $width }) => $width || '15rem'};
  color: ${({ theme }) => theme.colors.black};
  background: ${({ $color, theme }) => theme.colors[$color]};
`;
