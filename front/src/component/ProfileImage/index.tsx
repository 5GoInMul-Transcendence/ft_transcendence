import gravatar from 'gravatar';

interface Props {
  url: string;
  size: string;
}

export default function ProfileImage({ url, size }: Props) {
  if (!url) return;
  return (
    <img
      src={`http://${process.env.NEXT_PUBLIC_BAKC_SERVER}:${process.env.NEXT_PUBLIC_BACK_MAIN_PORT}/avatar/${url}`}
      alt={'url'}
      style={{ borderRadius: '70%' }}
      width={size}
      height={size}
    />
  );
}
