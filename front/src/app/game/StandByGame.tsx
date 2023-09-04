import { useEffect, useState } from 'react';
import styled from 'styled-components';

export default function StandByGame() {
  const [count, setCount] = useState<number>();

  useEffect(() => {
    setTimeout(() => {
      setCount(3);
    }, 0);
    setTimeout(() => {
      setCount(2);
    }, 1000);
    setTimeout(() => {
      setCount(1);
    }, 2000);
  }, []);
  return <Container>{count}</Container>;
}

const Container = styled.div`
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
  font-size: ${({ theme }) => theme.fontSize.xlarge};
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;
