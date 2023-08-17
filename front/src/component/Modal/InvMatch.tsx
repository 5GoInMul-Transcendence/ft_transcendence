import styled from 'styled-components';
import Button from '../Buttons/Button';

export default function InvMatch() {
  const invClassicMatchHandler = async () => {};
  const invShortMatchHandler = async () => {};

  return (
    <Wrapper>
      <Button text='classic' color='green' onClick={invClassicMatchHandler} />
      <Button text='short' color='green' onClick={invShortMatchHandler} />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  ${({ theme }) => theme.flex.centerColumn};
  justify-content: space-between;
  width: 100%;
  height: 8rem;
`;
