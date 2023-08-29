import Buttons from '@/component/Buttons';
import ProfileImage from '@/component/ProfileImage';
import styled from 'styled-components';

export default function InvedMatch() {
  //TODO: 추후 매칭 데이터에 따라 닉네임 받기
  const nickname = 'jiyokim';

  const declineMatchHandler = async () => {};
  const acceptMatchHandler = async () => {};

  return (
    <Wrapper>
      <ProfileImage url='' size='150px' />
      <div>{`invitation from ${nickname}`}</div>
      <Buttons
        leftButton={{
          text: 'decline',
          color: 'pink',
          onClick: declineMatchHandler,
        }}
        rightButton={{
          text: 'accept',
          color: 'green',
          onClick: acceptMatchHandler,
        }}
      />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  ${({ theme }) => theme.flex.centerColumn};
  justify-content: space-between;
  width: 100%;
  height: 18rem;
`;
