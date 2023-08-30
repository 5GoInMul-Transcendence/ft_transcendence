'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import useInput from '@/hooks/useInput';
import { Form, FormWrapper } from '@/app/(auth)/styles';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { axiosInstance } from '@/utils/axios';

export default function Login() {
  const [id, , onChangeId] = useInput('');
  const [password, , onChangePassword] = useInput('');

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      console.log(id, password);
      try {
        const res = await axiosInstance.post('/login', {
          id: id,
          password: password,
        });
      } catch (error) {
        // 데이터 패치 에러
        console.log(error, 'error');
      }
    },
    [id, password]
  );
  const onClickOAuth = () => {
    location.href = 'http://localhost:8080/login/oauth/42';
  };
  return (
    <FormWrapper>
      <Form onSubmit={onSubmit}>
        <div>ID</div>
        <input type='id' value={id} onChange={onChangeId} maxLength={12} />
        <div>Password</div>
        <input type='password' value={password} onChange={onChangePassword} />
        <button type='submit'>Login</button>
      </Form>
      <button onClick={onClickOAuth}>Login with 42</button>
      <SignupDiv>
        Did you not register? &nbsp;
        <Link href='/signup'>Go to Signup</Link>
      </SignupDiv>
    </FormWrapper>
  );
}

const SignupDiv = styled.div`
  font-size: ${({ theme }) => theme.fontSize.xxsmall};
  margin-top: 1.8rem;
  a {
    text-decoration: underline;
    text-decoration-color: white;
  }
`;
