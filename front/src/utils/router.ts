import { useRouter } from 'next/navigation';

const route = useRouter();

export const routePush = (url: string) => {
  route.push(url);
};
