'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import styled from 'styled-components';

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.push('/login');
  }, []);
  return <TestDiv>secret page.. </TestDiv>;
}

const TestDiv = styled.div`
  ${({ theme }) => theme.flex.center};
  color: ${({ theme }) => theme.colors.yellow};
`;
