import useInput from '@/hooks/useInput';
import Input from '@/component/Input';
import Button from '@/component/Buttons/Button';
import InvalidMsg from './InvalidMsg';
import styled from 'styled-components';
import { axiosInstance } from '@/utils/axios';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { invalidMsgState, modalState } from '@/utils/recoil/atom';
import { useSWRConfig } from 'swr';

export default function AuthMail() {
  const { mutate } = useSWRConfig();
  const [mail, , onChangeMail] = useInput('');
  const [code, , onChangeCode] = useInput('');
  const setModal = useSetRecoilState(modalState);
  const [invalidMsg, setInvalidMsg] = useRecoilState(invalidMsgState);
  const sendMailHandler = async () => {
    const regExp =
      /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    if (regExp.test(mail) === false) {
      setInvalidMsg(() => '이메일 형식이 올바르지 않습니다');
      return;
    }
    setInvalidMsg(() => '');
    axiosInstance.post('/auth/mail', { mail: mail }).then();
  };

  const authMailHandler = async () => {
    axiosInstance.post('/auth', { code: code }).then(() => {
      mutate('/me');
      mutate('/me/details');
      setModal(null);
    });
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
      <Input
        label='Code'
        type='text'
        value={code}
        onChange={onChangeCode}
        maxLength={100}
      />
      <InvalidMsg text={invalidMsg} />
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
