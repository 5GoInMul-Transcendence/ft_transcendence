import { useCallback, useState } from 'react';

import styled from 'styled-components';

export default function AuthSelect() {
  const [auth, setAuth] = useState('DEFALUT!');

  const onChangeAuth = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setAuth(e.target.value);
    },
    [auth]
  );

  return (
    <>
      <Wrapper>
        <span>2FA STATUS</span>
        <span>
          <AuthSelectItem onChange={onChangeAuth}>
            <option value='DISABLE'>DISABLE</option>
            <option value='MAIL'> MAIL</option>
            <option value='PHONE'>PHONE</option>
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

const AuthStatus = styled.a`
  font-size: ${({ theme }) => theme.fontSize.large};
  color: ${({ theme }) => theme.colors.green};
`;
