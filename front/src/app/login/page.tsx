"use client";
import { useCallback } from "react";
import Link from "next/link";
import useInput from "@/hooks/useInput";
import styled from "styled-components";
import Pong from "@/component/Pong";

export default function Login() {
  const [id, , onChangeId] = useInput("");
  const [password, , onChangePassword] = useInput("");

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      console.log("press submit");
    },
    [id, password]
  );
  return (
    <Container>
      <Pong />
      <Form onSubmit={onSubmit}>
        <div>ID</div>
        <input type="id" value={id} onChange={onChangeId} />
        <div>PASSWORD</div>
        <input type="password" value={password} onChange={onChangePassword} />
        <button type="submit">L0GiN</button>
        <div>Did you not register as a member?</div>
        <Link href="/signup">go to Signup</Link>
      </Form>
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  place-items: center center;
  height: 100%;
`;

const Form = styled.form`
  ${({ theme }) => theme.flex.centerColumn};
  background: ${({ theme }) => theme.colors.darkgrey};
  padding: 0.5rem;
  div {
    width: 100%;
  }
  input {
    margin: 0.5rem 0rem 0.5rem 0;
  }
`;
