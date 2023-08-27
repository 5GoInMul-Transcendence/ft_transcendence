import { useState } from 'react';
import useInput from '@/hooks/useInput';
import Input from '@/component/Input';
import Button from '@/component/Buttons/Button';
import InvalidMsg from './InvalidMsg';
import { styled } from 'styled-components';

export default function EnterChannel() {
  const [keyword, , onChangeKeyword] = useInput('');
  const [invalidMsg, setInvalidMsg] = useState<string>('');
  /* todo: 추후 데이터에 따라 채널명 받기 */
  const channelName = '11';

  const setPasswordHandler = async () => {
    if (keyword === '') {
      setInvalidMsg(() => 'password is empty');
      return;
    }
    /* todo: 비밀번호 data 요청, response에 따라 inValidMsg 설정 
		예시)
		'invalid passowrd'
		...
		*/
    setInvalidMsg(() => 'invalid passowrd');
  };

  return (
    <>
      <ChannelName>{`Channel ${channelName}`}</ChannelName>
      <Input
        label='password'
        type='password'
        value={keyword}
        onChange={onChangeKeyword}
        maxLength={12}
      />
      <InvalidMsg text={invalidMsg} />
      <Button text='submit' color='green' onClick={setPasswordHandler} />
    </>
  );
}

const ChannelName = styled.div`
  ${({ theme }) => theme.flex.center};
  margin: 3rem 0;
  font-size: ${({ theme }) => theme.fontSize.normal};
`;
