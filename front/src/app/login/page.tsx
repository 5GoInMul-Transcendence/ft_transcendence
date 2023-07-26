'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import useInput from '@/hooks/useInput';
import styled from 'styled-components';
import Pong from '@/component/Pong';
import PingPongAnimation from '@/component/PingPongAnimation';

export default function Login() {
  const [id, , onChangeId] = useInput('');
  const [password, , onChangePassword] = useInput('');

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
    },
    [id, password]
  );
  return (
    <Container>
      <Wrapper>
        <Pong />
        <PingPongAnimation />
      </Wrapper>
      <Wrapper>
        <LoginFormWrapper>
          <LoginForm onSubmit={onSubmit}>
            <div>ID</div>
            <input type='id' value={id} onChange={onChangeId} maxLength={12} />
            <div>Password</div>
            <input
              type='password'
              value={password}
              onChange={onChangePassword}
            />
            <button type='submit'>Login</button>
          </LoginForm>
          <button>Login with 42</button>
          <SignupDiv>
            Did you not register? &nbsp;
            <Link href='/signup'>Go to Signup</Link>
          </SignupDiv>
        </LoginFormWrapper>
      </Wrapper>
    </Container>
  );
}

const Container = styled.div`
  ${({ theme }) => theme.flex.center};
  height: 100%;
  width: 100%;
  flex-wrap: wrap;
  gap: 0 3rem;
`;

const Wrapper = styled.div`
  width: 30rem;
  ${({ theme }) => theme.flex.centerColumn};
`;

const LoginFormWrapper = styled.div`
  ${({ theme }) => theme.flex.centerColumn};
  background: ${({ theme }) => theme.colors.darkgrey};
  width: 25rem;
  padding: 2.5rem 1rem 1rem 1rem;
  font-size: ${({ theme }) => theme.fontSize.xsmall};
  * {
    margin: 0.3rem 0;
  }
  button {
    width: 16rem;
    height: 2rem;
    text-align: center;
    border: 1px solid white;
    border-radius: 10px;
    margin-top: 1.8rem;
  }
`;

const SignupDiv = styled.div`
  font-size: ${({ theme }) => theme.fontSize.xxsmall};
  margin-top: 1.8rem;
  a {
    text-decoration: underline;
    text-decoration-color: white;
  }
`;

const LoginForm = styled.form`
  width: 20rem;
  ${({ theme }) => theme.flex.centerColumn};
  * {
    width: 100%;
  }
  input {
    margin: 0.5rem 0;
    padding: 0.3rem;
    border-bottom: 1px solid white;
  }
`;
