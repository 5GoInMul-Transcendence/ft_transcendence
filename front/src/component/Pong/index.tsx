import styled from "styled-components";

export default function Pong() {
  return (
    <HeaderContainer>
      <span>P</span>
      <span>o</span>
      <span>n</span>
      <span>g</span>
    </HeaderContainer>
  );
}

const HeaderContainer = styled.div`
  color: ${({ theme }) => theme.colors.yellow};
  font-size: ${({ theme }) => theme.fontSize.large};
  span:nth-child(2),
  span:nth-child(3) {
    color: ${({ theme }) => theme.colors.green};
  }
`;
