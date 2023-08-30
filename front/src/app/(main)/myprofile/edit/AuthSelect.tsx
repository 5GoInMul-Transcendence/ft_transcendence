import { axiosInstance } from '@/utils/axios';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

interface AuthSelectProps {
  twoFactor: string;
}

export default function AuthSelect({ twoFactor }: AuthSelectProps) {
  const [auth, setAuth] = useState(twoFactor);

  const onChangeAuth = (e: React.ChangeEvent<HTMLSelectElement>) => {
    axiosInstance.put('me/twofactor', { twofactor: e.target.value }).then();
  };

  useEffect(() => {
    setAuth(twoFactor);
  }, [twoFactor]);

  return (
    <>
      <Wrapper>
        <span>2FA STATUS</span>
        <span>
          <AuthSelectItem onChange={onChangeAuth} value={auth}>
            <option value='disabled'>DISABLE</option>
            <option value='mail'>MAIL</option>
            <option value='phone'>PHONE</option>
          </AuthSelectItem>
        </span>
      </Wrapper>
      <AuthStatus>{auth}</AuthStatus>
    </>
  );
}

const Wrapper = styled.div`
  ${({ theme }) => theme.flex.spaceBetween}
`;

const AuthSelectItem = styled.select`
  border: 1px solid ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.fontSize.large};
  text-align: center;
  color: ${({ theme }) => theme.colors.white};
  background-color: ${({ theme }) => theme.colors.black};
`;

const AuthStatus = styled.div`
  font-size: ${({ theme }) => theme.fontSize.large};
  color: ${({ theme }) => theme.colors.green};
`;
