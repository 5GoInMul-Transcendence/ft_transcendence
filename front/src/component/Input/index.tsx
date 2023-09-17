import styled from 'styled-components';

interface Props {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  maxLength: number;
}

export default function Input({
  label,
  type,
  value,
  onChange,
  maxLength,
}: Props) {
  return (
    <Wrapper>
      <label htmlFor={label}>{label}</label>
      <input
        type={type}
        id={label}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
      />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  * {
    width: 100%;
  }
  label {
    font-size: ${({ theme }) => theme.fontSize.normal};
    color: ${({ theme }) => theme.colors.black};
  }
  input {
    margin: 1rem 0 2rem;
    padding: 0.8rem 0.5rem;
    border-radius: 0.8rem;
    font-size: ${({ theme }) => theme.fontSize.small};
    background: ${({ theme }) => theme.colors.white};
  }
`;
