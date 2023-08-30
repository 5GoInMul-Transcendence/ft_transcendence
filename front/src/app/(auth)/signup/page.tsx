'use client';

import React, { useCallback, useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import useInput from '@/hooks/useInput';
import { Form, FormWrapper } from '../styles';
import axios from 'axios';
import { axiosInstance } from '@/utils/axios';

export default function SignUp() {
  const [id, , onChangeId] = useInput('');
  const [password, setPassword] = useInput('');
  const [passwordCheck, setPasswordCheck] = useInput('');
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

      axiosInstance
        .post('http://localhost:8080/signup', {
          id: id,
          password: password,
        })
        .then();
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
