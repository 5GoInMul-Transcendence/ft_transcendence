import styled from 'styled-components';
import ProfileImage from '../ProfileImage';

const friends = [
  { name: 'kipark', url: '', status: 'online' },
  { name: 'jayoon', url: '', status: 'offline' },
  { name: 'donghyun', url: '', status: 'offline' },
  { name: 'jabae', url: '', status: 'online' },
  { name: 'jiyo', url: '', status: 'online' },
];

export default function FriendList() {
  return (
    <div>
      {friends.map((e) => (
        <FriendItem>
          <div>
            <ProfileImage url='' size='35px' />
            &nbsp;{e.name}
          </div>
          <StatusDiv stat={e.status} />
        </FriendItem>
      ))}
    </div>
  );
}

const FriendItem = styled.div`
  ${({ theme }) => theme.flex.spaceBetween};
  margin: 0.4rem;
  font-size: ${({ theme }) => theme.fontSize.xsmall};
  div {
    ${({ theme }) => theme.flex.center};
  }
`;

const StatusDiv = styled.div<{ stat: string }>`
  width: 10px;
  height: 10px;
  border-radius: 100%;
  background-color: ${({ theme, stat }) =>
    stat == 'online' ? theme.colors.green : theme.colors.pink};
`;
