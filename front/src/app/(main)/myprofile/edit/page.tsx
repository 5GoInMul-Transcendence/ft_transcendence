'use client';

import AuthSelect from './AuthSelect';
import EditItem from './EditItem';
import ProfileImage from '@/component/ProfileImage';
import styled from 'styled-components';
import useSwrFetcher from '@/hooks/useSwrFetcher';
import { IUserDetail } from '@/types/IUser';
import { useSetRecoilState } from 'recoil';
import { modalState } from '@/utils/recoil/atom';

export default function Profile() {
  const data = useSwrFetcher<IUserDetail>('/me/details');
  const setModal = useSetRecoilState(modalState);

  if (!data) return;

  return (
    <Container>
      <TopWrapper>
        <Wrapper $width={3}>
          <EditProfileInput type='file' accept='image/*' />
          <ProfileImage url='' size='250px' />
        </Wrapper>
        <Wrapper $width={7}>
          <EditItem
            title='NICNAME'
            content={data?.nickname || ''}
            onClickEdit={() => {
              setModal({ type: 'SET-Nick' });
            }}
          />
          <EditItem
            title='EMAIL'
            content={data?.mail || ''}
            onClickEdit={() => {
              setModal({ type: 'AUTH-Mail' });
            }}
          />
          <EditItem
            title='PHONE'
            content={data?.phone || ''}
            onClickEdit={() => {
              setModal({ type: 'AUTH-Phone' });
            }}
          />
          <AuthSelect twoFactor={data?.twoFactor || 'disabled'} />
        </Wrapper>
      </TopWrapper>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 2rem 0;
`;

const TopWrapper = styled.div`
  ${({ theme }) => theme.flex.center};
  width: 80%;
  height: 28rem;
`;

const EditProfileInput = styled.input`
  width: 20px;
  height: 20px;
  margin-bottom: -20px;
  color: transparent;
  text-indent: -9999px;
  background-image: url('/pen-white.svg');
  &:hover {
    cursor: pointer;
  }
  &::file-selector-button {
    display: none;
  }
`;

const Wrapper = styled.div<{ $width: number }>`
  flex: ${({ $width }) => $width};
  display: flex;
  flex-direction: column;
  margin: 0 2rem;
  height: 100%;
`;