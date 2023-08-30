import { useState } from 'react';
import useInput from '@/hooks/useInput';
import Input from '@/component/Input';
import Button from '@/component/Buttons/Button';
import InvalidMsg from './InvalidMsg';
import styled from 'styled-components';
import { axiosInstance } from '@/utils/axios';

export default function AuthMail() {
  const [mail, , onChangeMail] = useInput('');
  const [code, , onChangeCode] = useInput('');
  const [invalidMailMsg, setInvalidMailMsg] = useState<string>('');
  const [invalidCodeMsg, setInvalidCodeMsg] = useState<string>('');

  const sendMailHandler = async () => {
    const regExp =
      /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    if (regExp.test(mail) === false) {
      setInvalidMailMsg(() => 'Wrong mail address');
      return;
    }
    axiosInstance.post('/auth/mail', { mail: mail }).then();
    setInvalidMailMsg(() => '');
    /* todo: 메일 data 요청, response에 따라 invalidMailMsg 설정 */
  };

  const authMailHandler = async () => {
    axiosInstance.post('/auth', { code: code }).then();

    /* todo: 인증 data 요청, response에 따라 invalidCodeMsg 설정 */
    setInvalidCodeMsg(() => 'Wrong Code');
  };

  return (
    <>
      <InputButtonWrapper>
        <Input
          label='Mail'
          type='email'
          value={mail}
          onChange={onChangeMail}
          maxLength={320}
        />
        <Button
          text='send'
          color='green'
          width='8rem'
          onClick={sendMailHandler}
        />
      </InputButtonWrapper>
      <InvalidMsg text={invalidMailMsg} />
      <Input
        label='Code'
        type='text'
        value={code}
        onChange={onChangeCode}
        maxLength={100}
      />
      <InvalidMsg text={invalidCodeMsg} />
      <Button text='submit' color='green' onClick={authMailHandler} />
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
