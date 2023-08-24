import gravatar from 'gravatar';

interface Props {
  url: string;
  size: string;
}

export default function ProfileImage({ url, size }: Props) {
  return (
    <img
      src={gravatar.url('kipark@ki.com', {
        s: `${size}`,
        d: 'retro',
      })}
      alt={'kipark'}
      style={{ borderRadius: '70%' }}
    />
  );
}
