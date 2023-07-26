'use client';

import React, { useCallback, useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import Pong from '@/component/Pong';
import useInput from '@/hooks/useInput';
import PingPongAnimation from '@/component/PingPongAnimation';

export default function SignUp() {
  const [email, , onChangeEmail] = useInput('');
  const [id, , onChangeId] = useInput('');
  const [password, setPassword] = useInput('');
  const [passwordCheck, setPasswordCheck] = useInput('');
  const [authCode, , onChangeAuthCode] = useInput('');
  const [mismatchError, setMismatchError] = useState(false);
  const onChangePasswordCheck = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPasswordCheck(e.target.value);
      setMismatchError(e.target.value === password);
    },
    [passwordCheck]
  );
  const onChangePassword = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
      setMismatchError(e.target.value === passwordCheck);
    },
    [password]
  );
  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (mismatchError) {
      }
    },
    [email, id, password, passwordCheck, mismatchError]
  );
  return (
    <Container>
      <Wrapper>
        <Pong />
        <PingPongAnimation />
      </Wrapper>
      <Wrapper>
        <FormWrapper>
          <Form onSubmit={onSubmit}>
            <div>ID</div>
            <input
              type='text'
              value={id}
              onChange={onChangeId}
              maxLength={12}
            />
            <div>Password</div>
            <input
              type='password'
              value={password}
              onChange={onChangePassword}
            />
            <div>Repeat Password</div>
            <input
              type='password'
              value={passwordCheck}
              onChange={onChangePasswordCheck}
            />
            {mismatchError && <div>x password does not match</div>}
            <div>Email</div>
            <input type='email' value={email} onChange={onChangeEmail} />
            <div>Authentication Code</div>
            <input value={authCode} onChange={onChangeAuthCode} />
            <button type='submit'>Create Account</button>
          </Form>
          <LoginDiv>
            Already signed up? &nbsp;
            <Link href='/login'>Go to Login</Link>
          </LoginDiv>
        </FormWrapper>
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

const FormWrapper = styled.div`
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

const LoginDiv = styled.div`
  font-size: ${({ theme }) => theme.fontSize.xxsmall};
  margin-top: 1.8rem;
  a {
    text-decoration: underline;
    text-decoration-color: white;
  }
`;

const Form = styled.form`
  width: 20rem;
  background-color: ${({ theme }) => theme.colors.darkgrey};
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
