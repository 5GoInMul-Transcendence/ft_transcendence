import ProfileImage from '@/component/ProfileImage';
import Buttons from '@/component/Buttons';
import Toggle from '@/component/Toggle';
import useToggle from '@/hooks/useToggle';
import styled from 'styled-components';

export default function SetUser() {
  const [admin, onChangeAdmin] = useToggle(false);
  const [mute, onChangeMute] = useToggle(false);
  /* todo: 추후 데이터에 따라 닉네임 받기 */
  const nickname = 'jiyokim';

  const banUserHandler = async () => {};
  const kickUserHandler = async () => {};

  return (
    <Wrapper>
      <WrapperSection>
        <div>
          <ProfileImage url='' size='150px' />
          <div>{nickname}</div>
        </div>
        <div>
          <Toggle
            text='admin'
            color='green'
            checked={admin}
            onToggle={onChangeAdmin}
          />
          <Toggle
            text='mute'
            color='green'
            checked={mute}
            onToggle={onChangeMute}
          />
        </div>
      </WrapperSection>
      <Buttons
        leftButton={{
          text: 'ban',
          color: 'pink',
          onClick: banUserHandler,
        }}
        rightButton={{
          text: 'kick',
          color: 'grey',
          onClick: kickUserHandler,
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

const WrapperSection = styled.section`
  ${({ theme }) => theme.flex.spaceBetween};
  width: 80%;
  div:nth-child(2) {
    margin-top: 1.5rem;
    text-align: center;
  }
`;
