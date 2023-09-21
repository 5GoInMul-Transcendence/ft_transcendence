import useSocket from '@/hooks/useSocket';

interface Props {
  content: string;
  userId: number;
}

export default function GameInvite({ content, userId }: Props) {
  const [socket] = useSocket('10001/main');
  const onMatch = () => {
    socket?.emit('inviteMatch', {
      inviteUserId: userId,
    });
  };
  return <div onClick={onMatch}>{content}</div>;
}
