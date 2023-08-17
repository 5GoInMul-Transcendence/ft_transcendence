import { useState } from 'react';
import AddFriend from './AddFriend';
import AuthPhone from './AuthPhone';
import AuthMail from './AuthMail';
import InvMatch from './InvMatch';
import InvedMatch from './InvedMatch';
import SetNick from './SetNick';
import SetUser from './SetUser';
import styled from 'styled-components';

export default function Modal() {
  /*todo: 추후 recoil로 여러 페이지 및 컴포넌트에서 관리 */
  const [modal, setModal] = useState<string | null>('ADD-Friend');

  const modalStorage: Record<string, Record<string, string | JSX.Element>> = {
    'ADD-Friend': { title: 'Add Friend', child: <AddFriend /> },
    'INV-Match': { title: '1:1 match', child: <InvMatch /> },
    'INVED-Match': { title: '1:1 match', child: <InvedMatch /> },
    'SET-User': { title: 'user setting', child: <SetUser /> },
    'SET-Nick': { title: 'Change Nickname', child: <SetNick /> },
    'AUTH-Mail': { title: 'Mail Authentication', child: <AuthMail /> },
    'AUTH-Phone': { title: 'Phone Authentication', child: <AuthPhone /> },
  };

  const closeModal = (e: React.MouseEvent) => {
    setModal(() => null);
  };

  return (
    modal && (
      <BackDrop>
        <ModalWrap>
          <TitleDiv>{modalStorage[modal].title}</TitleDiv>
          <CloseDiv>X</CloseDiv>
          {modalStorage[modal].child}
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
  width: 30rem;
  padding: 3rem 2rem;
  color: ${({ theme }) => theme.colors.black};
  background-color: ${({ theme }) => theme.colors.lightgrey};
`;

const TitleDiv = styled.div`
  ${({ theme }) => theme.flex.center};
  margin-bottom: 3rem;
  font-size: ${({ theme }) => theme.fontSize.normal};
`;

const CloseDiv = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  font-size: ${({ theme }) => theme.fontSize.large};
`;
