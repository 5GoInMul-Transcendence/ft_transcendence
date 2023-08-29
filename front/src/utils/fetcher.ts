import { axiosInstance } from './axios';

const fetcher = async (url: string) =>
  axiosInstance.get(url).then((res) => res);

export default fetcher;
