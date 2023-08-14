'use client';

import { FormEvent } from 'react';
import { Form, FormWrapper } from '../styles';

export default function TwoFactor() {
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
  };
  return (
    <FormWrapper>
      <Form onSubmit={onSubmit}>
        <div>2FA CODE</div>
        <input />
        <button>submit</button>
      </Form>
    </FormWrapper>
  );
}
