import { useEffect, useState } from 'react';
import styled from 'styled-components';

export default function GameEnd() {
  return (
    <Container>
      <div>Game End !!!</div>
    </Container>
  );
}

const Container = styled.div`
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
  font-size: ${({ theme }) => theme.fontSize.xxlarge};
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;
