import { useState } from 'react';
import useInput from '@/hooks/useInput';
import Input from '@/component/Input';
import Button from '@/component/Buttons/Button';
import InvalidMsg from './InvalidMsg';
import styled from 'styled-components';
import { axiosInstance } from '@/utils/axios';

export default function AuthPhone() {
  const [phone, , onChangePhone] = useInput('');
  const [code, , onChangeCode] = useInput('');
  const [invalidPhoneMsg, setInvalidPhoneMsg] = useState<string>('');
  const [invalidCodeMsg, setInvalidCodeMsg] = useState<string>('');

  const sendPhoneHandler = async () => {
    const regExp = /\d{2,3}-\d{3,4}-\d{4}/g;
    if (regExp.test(phone) === false) {
      axiosInstance.post('/auth/phone', { phone: phone }).then();
      setInvalidPhoneMsg(() => 'Wrong phone number');
      return;
    }
    setInvalidPhoneMsg(() => '');
    /* todo: 폰 data 요청, response에 따라 invalidPhoneMsg설정 */
  };

  const authPhoneHandler = async () => {
    /* todo: 인증 data 요청, response에 따라 invalidCodeMsg 설정 */
    axiosInstance.post('/auth', { code: code }).then();
    setInvalidCodeMsg(() => 'Wrong Code');
  };

  return (
    <>
      <InputButtonWrapper>
        <Input
          label='Phone'
          type='text'
          value={phone}
          onChange={onChangePhone}
          maxLength={11}
        />
        <Button
          text='send'
          color='green'
          width='8rem'
          onClick={sendPhoneHandler}
        />
      </InputButtonWrapper>
      <InvalidMsg text={invalidPhoneMsg} />
      <Input
        label='Code'
        type='text'
        value={code}
        onChange={onChangeCode}
        maxLength={100}
      />
      <InvalidMsg text={invalidCodeMsg} />
      <Button text='submit' color='green' onClick={authPhoneHandler} />
    </>
  );
}

const InputButtonWrapper = styled.div`
  ${({ theme }) => theme.flex.spaceBetween};
  input {
    width: 92%;
  }
  button {
    margin-top: calc(20px + 1rem);
    margin-bottom: 1rem;
  }
`;
