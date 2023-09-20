import axios from 'axios';

const baseURL = `http://${process.env.NEXT_PUBLIC_BACK_SERVER}:${process.env.NEXT_PUBLIC_BACK_MAIN_PORT}/`;

export const axiosInstance = axios.create({ baseURL });

axiosInstance.interceptors.request.use(function setConfig(config) {
  config.withCredentials = true;
  return config;
});
