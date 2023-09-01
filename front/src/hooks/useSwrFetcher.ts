import useSwr from 'swr';
import fetcher from '@/utils/fetcher';

const useSwrFetcher = <T>(api: string): T | undefined => {
  const { data } = useSwr(api, fetcher);

  if (data?.resStatus.code !== '0000') return undefined;
  if (data?.resStatus.code !== '1000') return undefined;
  if (data?.resStatus.code !== '2000') return undefined;

  return data?.data;
};

export default useSwrFetcher;
