import { axiosInstance } from './axios';

const fetcher = async (url: string) =>
  axiosInstance.get(url).then((response) => response.data);

export default fetcher;
