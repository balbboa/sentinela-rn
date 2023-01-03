import axios, {AxiosInstance} from 'axios';
import {getToken} from './auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {baseURL} from './api';
// URL da API

const REFRESH_URL = `${baseURL}/auth/login`;

//para multiplas requisições
let isRefreshing = false;
let failedQueue: any[] = [];
let requestsLimit = 0;

// Processa a fila de promises
const processQueue = (token = null) => {
  failedQueue.forEach(req => {
    req.headers['Authorization'] = 'Bearer ' + token;
  });
  requestsLimit = 0;
  failedQueue = [];
};

const interceptor = (axiosInstance: AxiosInstance) => async (error: any) => {
  const _axios: any = axiosInstance;
  let originalRequest: any = {};
  originalRequest = error.config;

  if (error.data?.status === false) {
    // Se existir alguma requisição concorrente atualizando o token
    // ela será mandada para uma fila
    if (isRefreshing) {
      failedQueue.push(originalRequest);
      requestsLimit++;
      if (requestsLimit > 50) return Promise.reject(error);
    }

    originalRequest._retry = true;
    isRefreshing = true;
    //
    const refreshToken = await getToken();
    return new Promise((resolve, reject) => {
      axios
        .post(REFRESH_URL, {
          token: refreshToken,
        })
        .then(async data => {
          const token = data.data.access_token;
          // cadastrar token
          await AsyncStorage.setItem('@storage_Key', token);
          // seta o token no localstorage

          _axios.defaults.headers['Authorization'] = 'Bearer ' + token;
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          processQueue(token);
          resolve(_axios(originalRequest));
        })
        .catch(err => {
          reject(err);
        });
    });
  }
  return Promise.reject(error);
};

export default interceptor;
