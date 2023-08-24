import Button from '@/component/Buttons/Button';
import { Props as ButtonProps } from '@/component/Buttons/Button';
import styled from 'styled-components';

interface Props {
  button?: {
    width: string;
  };
  leftButton: ButtonProps;
  rightButton: ButtonProps;
}

export default function Buttons({ button: b, leftButton, rightButton }: Props) {
  return (
    <Wrapper>
      <Button {...leftButton} width={b?.width} />
      <Button {...rightButton} width={b?.width} />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  ${({ theme }) => theme.flex.spaceBetween};
  width: 100%;
`;
