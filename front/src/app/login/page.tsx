'use client';
import { useCallback } from 'react';
import Link from 'next/link';
import useInput from '@/hooks/useInput';
import styled from 'styled-components';
import Pong from '@/component/Pong';

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
      </Wrapper>
      <Wrapper>
        <LoginForm>
          <Form onSubmit={onSubmit}>
            <div>ID</div>
            <input type='id' value={id} onChange={onChangeId} />
            <div>password</div>
            <input
              type='password'
              value={password}
              onChange={onChangePassword}
            />
            <button type='submit'>L0GIN</button>
          </Form>
          <button>Login with 42</button>
          <Div>
            Did you not register? &nbsp;
            <Link href='/signup'>go to Signup</Link>
          </Div>
        </LoginForm>
      </Wrapper>
    </Container>
  );
}

const Container = styled.div`
  ${({ theme }) => theme.flex.center};
  height: 100%;
  width: 100%;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0 8rem;
`;
const Wrapper = styled.div`
  width: 24rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoginForm = styled.div`
  ${({ theme }) => theme.flex.centerColumn};
  background: ${({ theme }) => theme.colors.darkgrey};
  width: 24rem;
  height: 24rem;
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

const Div = styled.div`
  font-size: ${({ theme }) => theme.fontSize.xxsmall};
  margin-top: 2.4rem;
`;

const Form = styled.form`
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
