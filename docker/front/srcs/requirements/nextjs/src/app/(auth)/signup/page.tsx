'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import useInput from '@/hooks/useInput';
import { Form, FormWrapper } from '../styles';

export default function SignUp() {
  const [id, , onChangeId] = useInput('');
  const [password, setPassword] = useInput('');
  const [passwordCheck, setPasswordCheck] = useInput('');
  const [mismatchError, setMismatchError] = useState(false);

  const onChangePasswordCheck = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPasswordCheck(e.target.value);
    },
    [passwordCheck]
  );
  console.log(password, passwordCheck);
  const onChangePassword = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
    },
    [password]
  );

  useEffect(() => {
    setMismatchError(password === passwordCheck);
  }, [password, passwordCheck]);

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (mismatchError) {
      }
    },
    [id, password, passwordCheck, mismatchError]
  );

  return (
    <FormWrapper>
      <Form onSubmit={onSubmit}>
        <div>ID</div>
        <input type='text' value={id} onChange={onChangeId} maxLength={12} />
        <div>Password</div>
        <input type='password' value={password} onChange={onChangePassword} />
        <div>Repeat Password</div>
        <input
          type='password'
          value={passwordCheck}
          onChange={onChangePasswordCheck}
        />
        {mismatchError && <div>x password does not match</div>}
        <button type='submit'>Create Account</button>
      </Form>
      <LoginDiv>
        Already signed up? &nbsp;
        <Link href='/login'>Go to Login</Link>
      </LoginDiv>
    </FormWrapper>
  );
}

const LoginDiv = styled.div`
  font-size: ${({ theme }) => theme.fontSize.xxsmall};
  margin-top: 1.8rem;
  a {
    text-decoration: underline;
    text-decoration-color: white;
  }
`;
