import axios from 'axios';

// const baseURL = `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}` ;
const baseURL = `http://localhost:8080/`;

export const axiosInstance = axios.create({ baseURL });

axiosInstance.interceptors.request.use(function setConfig(config) {
  config.withCredentials = true;
  return config;
});
