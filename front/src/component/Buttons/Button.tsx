import styled from 'styled-components';

export interface Props {
  text: string;
  color: string;
  width?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export default function Button({ text, color, width, onClick }: Props) {
  return (
    <Wrapper>
      <WrapperButton $color={color} $width={width} onClick={onClick}>
        {text}
      </WrapperButton>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  ${({ theme }) => theme.flex.center};
`;

const WrapperButton = styled.button<{ $color: string; $width?: string }>`
  border-radius: 0.8rem;
  padding: 0 0.2rem;
  height: 3.5rem;
  text-align: center;
  width: ${({ $width }) => $width || '10rem'};
  color: ${({ theme }) => theme.colors.black};
  background: ${({ $color, theme }) => theme.colors[$color]};
`;
