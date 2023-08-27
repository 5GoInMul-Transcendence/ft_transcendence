import useSwr from 'swr';
import fetcher from '@/utils/fetcher';

interface IResState {
  code: string;
  message: string;
}

const useSwrFetcher = <T>(
  api: string
): [T | undefined, IResState | undefined] => {
  const { data } = useSwr(api, fetcher);

  return [data?.data, data?.resStatus];
};

export default useSwrFetcher;
