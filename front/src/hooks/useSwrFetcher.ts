import useSwr from 'swr';
import fetcher from '@/utils/fetcher';

const useSwrFetcher = <T>(api: string): T | undefined => {
  const { data, error } = useSwr(api, fetcher);

  return data?.data;
};

export default useSwrFetcher;
