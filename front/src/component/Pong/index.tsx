import styled from 'styled-components';

export default function Pong() {
  return (
    <HeaderContainer>
      <span>P</span>
      <span>o</span>
      <span>n</span>
      <span>g</span> Game
    </HeaderContainer>
  );
}

const HeaderContainer = styled.div`
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSize.xxlarge};
  span:nth-child(1),
  span:nth-child(4) {
    color: ${({ theme }) => theme.colors.yellow};
  }
  span:nth-child(2),
  span:nth-child(3) {
    color: ${({ theme }) => theme.colors.green};
  }
  text-align: center;
`;
