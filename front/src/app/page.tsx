"use client";
import styled from "styled-components";

export default function Home() {
  return <TestDiv>hi my name is jabae</TestDiv>;
}

const TestDiv = styled.div`
  ${({ theme }) => theme.flex.center};
  color: ${({ theme }) => theme.colors.yellow};
`;
