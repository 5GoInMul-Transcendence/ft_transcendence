import gravatar from 'gravatar';

interface Props {
  url: string;
  size: string;
}

export default function ProfileImage({ url, size }: Props) {
  return (
    <img
      src={`http://localhost:8080/avatar/${url}`}
      alt={'url'}
      style={{ borderRadius: '70%' }}
      width={size}
      height={size}
    />
  );
}
