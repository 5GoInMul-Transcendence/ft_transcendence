import styled, { keyframes } from 'styled-components';

export default function DotLoading() {
  return (
    <Container>
      <DotContainer>
        <Dot>o</Dot>
        <Dot>o</Dot>
        <Dot>o</Dot>
      </DotContainer>
    </Container>
  );
}

// 키프레임 애니메이션을 생성합니다.
const moveDot = keyframes`
0% {
  transform: translateY(0);
}
25% {
  transform: translateY(0);
}
50% {
  transform: translateY(-10px);
}
75% {
  transform: translateY(0);
}
100% {
  transform: translateY(0);
}
`;

const Container = styled.div``;

const DotContainer = styled.div`
  display: flex;
`;

const Dot = styled.span`
  font-size: 20px;
  margin: 1rem 1rem 2rem;
  animation: ${moveDot} 1s linear infinite;
  &:nth-child(1) {
    animation-delay: 0s;
  }
  &:nth-child(2) {
    animation-delay: 0.333s;
  }
  &:nth-child(3) {
    animation-delay: 0.666s;
  }
`;
