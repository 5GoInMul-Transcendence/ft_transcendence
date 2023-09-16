import { useState } from 'react';
import AddFriend from './AddFriend';
import AuthPhone from './AuthPhone';
import AuthMail from './AuthMail';
import InvMatch from './InvMatch';
import InvedMatch from './InvedMatch';
import SetNick from './SetNick';
import SetUser from './SetUser';
import styled from 'styled-components';
import EnterChannel from './EnterChannel';
import CreateChannel from './CreateChannel';
import SetChannel from './SetChannel';
import { useRecoilState } from 'recoil';
import { invalidMsgState, modalState } from '@/utils/recoil/atom';
import Error from './Error';
import MatchAccept from './MatchAccept';

export default function Modal() {
  const [modal, setModal] = useRecoilState(modalState);
  const [, setInvalidMsg] = useRecoilState(invalidMsgState);

  const modalStorage: Record<string, Record<string, string | JSX.Element>> = {
    'ADD-Friend': { title: 'Add Friend', child: <AddFriend /> },
    'INV-Match': { title: '', child: <InvMatch /> },
    'INVED-Match': { title: '1:1 match', child: <InvedMatch /> },
    'SET-User': {
      title: 'user setting',
      child: <SetUser {...modal?.modalProps} />,
    },
    'SET-Nick': { title: 'Change Nickname', child: <SetNick /> },
    'SET-Channel': {
      title: 'channel setting',
      child: <SetChannel {...modal?.modalProps} />,
    },
    'CREATE-Channel': { title: 'create channel', child: <CreateChannel /> },
    'ENTER-Channel': {
      title: '',
      child: <EnterChannel {...modal?.modalProps} />,
    },
    'AUTH-Mail': { title: 'Mail Authentication', child: <AuthMail /> },
    'AUTH-Phone': { title: 'Phone Authentication', child: <AuthPhone /> },
    'API-Error': { title: 'Error', child: <Error /> },
    'MATCH-Accept': { title: 'Match Accept', child: <MatchAccept /> },
  };

  const closeModal = (e: React.MouseEvent) => {
    setInvalidMsg('');
    setModal(() => null);
  };

  console.log(modal);
  return (
    modal && (
      <BackDrop>
        <ModalWrap>
          <TitleDiv>{modalStorage[modal.type].title}</TitleDiv>
          <CloseButton onClick={closeModal}>x</CloseButton>
          {modalStorage[modal.type].child}
        </ModalWrap>
      </BackDrop>
    )
  );
}

const BackDrop = styled.div`
  z-index: 5;
  position: fixed;
  top: 0;
  left: 0;
  width: -webkit-fill-available;
  height: -webkit-fill-available;
  background: rgba(0, 0, 0, 0.5);
  ${({ theme }) => theme.flex.center};
`;

const ModalWrap = styled.div`
  position: relative;
  width: 35rem;
  padding: 3rem 2rem;
  color: ${({ theme }) => theme.colors.black};
  background-color: ${({ theme }) => theme.colors.lightgrey};
`;

const TitleDiv = styled.div`
  ${({ theme }) => theme.flex.center};
  margin-bottom: 3rem;
  font-size: ${({ theme }) => theme.fontSize.normal};
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  font-size: ${({ theme }) => theme.fontSize.large};
`;
