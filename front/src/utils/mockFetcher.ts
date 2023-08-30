import axios from 'axios';

const mockFetcher = async (url: string) =>
  axios.get(url).then((res) => res.data);

export default mockFetcher;
