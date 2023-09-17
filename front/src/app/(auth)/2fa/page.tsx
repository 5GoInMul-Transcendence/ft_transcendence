'use client';

import { FormEvent } from 'react';
import { Form, FormWrapper } from '../styles';
import { axiosInstance } from '@/utils/axios';
import useInput from '@/hooks/useInput';
import { useRouter } from 'next/navigation';

export default function TwoFactor() {
  const [code, , onChangeCode] = useInput('');
  const route = useRouter();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    axiosInstance.post('/auth/2fa', { code: code }).then((res) => {
      route.push(res.data.data);
    });
  };

  return (
    <FormWrapper>
      <Form onSubmit={onSubmit}>
        <div>2FA CODE</div>
        <input type='text' value={code} onChange={onChangeCode} maxLength={4} />
        <button>submit</button>
      </Form>
    </FormWrapper>
  );
}
