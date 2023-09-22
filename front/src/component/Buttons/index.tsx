import Button from '@/component/Buttons/Button';
import { Props as ButtonProps } from '@/component/Buttons/Button';
import styled from 'styled-components';

interface Props {
  button?: {
    width: string;
  };
  windowWidth?: string;
  leftButton: ButtonProps;
  rightButton: ButtonProps;
}

export default function Buttons({
  button: b,
  windowWidth,
  leftButton,
  rightButton,
}: Props) {
  return (
    <Wrapper $windowWidth={windowWidth}>
      <Button {...leftButton} width={b?.width} />
      <Button {...rightButton} width={b?.width} />
    </Wrapper>
  );
}

const Wrapper = styled.div<{ $windowWidth: string }>`
  ${({ theme }) => theme.flex.spaceBetween};
  width: ${({ $windowWidth }) =>
    $windowWidth === undefined ? '70%' : $windowWidth};
`;
