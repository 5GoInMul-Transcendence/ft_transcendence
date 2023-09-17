import styled from 'styled-components';

interface Props {
  text: string;
  color: string;
  checked: boolean;
  onToggle: () => void;
}

export default function Toggle({ text, color, checked, onToggle }: Props) {
  return (
    <Wrapper>
      <ToggleLabel $color={color} htmlFor={`${text}-toggle`}>
        <input
          type='checkbox'
          id={`${text}-toggle`}
          checked={checked}
          onChange={onToggle}
        />
        <SwitchSpan />
      </ToggleLabel>
      {text}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  ${({ theme }) => theme.flex.spaceBetween};
  justify-content: flex-start;
`;

const SwitchSpan = styled.span`
  position: relative;
  width: 4rem;
  height: 2rem;
  border-radius: 2rem;
  background: ${({ theme }) => theme.colors.grey};
  padding: 0.3rem;

  &::before {
    position: absolute;
    content: '';
    top: 50%;
    left: 0.3rem;
    width: 1.6rem;
    height: 1.6rem;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.white};
    transform: translate(0, -50%);
    transition: 300ms all;
  }
`;

const ToggleLabel = styled.label<{ $color: string }>`
  display: flex;
  align-items: center;
  margin-right: 2rem;
  cursor: pointer;

  input:checked + ${SwitchSpan} {
    background: ${({ $color, theme }) => theme.colors[$color]};
    &:before {
      transform: translate(32px, -50%);
    }
  }
`;
