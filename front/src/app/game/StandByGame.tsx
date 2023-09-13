import { useEffect, useState } from 'react';
import styled from 'styled-components';

interface Props {
  count: number;
}
export default function StandByGame({ count }: Props) {
  const [countText, setCountText] = useState<number>();

  useEffect(() => {
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        setCountText(count - i);
      }, i * 1000);
    }
  }, []);
  return <Container>{countText}</Container>;
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
