'use client';

import AuthSelect from './AuthSelect';
import EditItem from './EditItem';
import ProfileImage from '@/component/ProfileImage';
import styled from 'styled-components';
import useSwrFetcher from '@/hooks/useSwrFetcher';
import { IUserDetail } from '@/types/IUser';
import { useSetRecoilState } from 'recoil';
import { invalidMsgState, modalState } from '@/utils/recoil/atom';
import { useCallback, useRef } from 'react';
import { useSWRConfig } from 'swr';
import { axiosInstance } from '@/utils/axios';

export default function Profile() {
  const { mutate } = useSWRConfig();
  const data = useSwrFetcher<IUserDetail>('/me/details');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const setModal = useSetRecoilState(modalState);
  const setInvalidMsg = useSetRecoilState(invalidMsgState);
  const onUploadImage = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) {
        return;
      }
      const formData = new FormData();
      formData.append('file', e.target.files[0]);
    
      const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
      if (e.target.files[0].size > maxSizeInBytes) {
        alert('파일 크기가 10MB를 초과합니다. 다른 파일을 선택해주세요.');
        return;
      }

      axiosInstance.put('/me/avatar', formData).then((res) => {
        mutate('/me');
        mutate('/me/details');
      });
    },
    []
  );

  if (!data) return;

  return (
    <Container>
      <TopWrapper>
        <Wrapper $width={3}>
          <EditProfileInput
            type='file'
            accept='image/*'
            ref={inputRef}
            onChange={onUploadImage}
          />
          <ProfileImage url={data.avatar} size='250px' />
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
