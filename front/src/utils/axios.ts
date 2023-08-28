import axios from 'axios';
import { useState } from 'react';
// const baseURL = `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}` ;
const baseURL = `localhost:8080`;

export const axiosInstance = axios.create({ baseURL });

axiosInstance.interceptors.request.use(function setConfig(config) {
  config.withCredentials = true;
  return config;
});
