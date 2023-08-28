import axios from 'axios';
import { apiHaddling } from './apiHaddling';
// const baseURL = `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}` ;
const baseURL = `http://localhost/api/`;

export const axiosInstance = axios.create({ baseURL });

axiosInstance.interceptors.request.use(function setConfig(config) {
  config.withCredentials = true;
  return config;
});

axiosInstance.interceptors.response.use((response) => {
  apiHaddling(response.data.data, response.data.resStatus);
  return response.data;
});
