import axios from 'axios';

import {getToken} from './auth';

export const baseURL = 'http://fontedados.ddns.net:3002/';

const api = axios.create({
  baseURL: baseURL + 'api/v1/',
});

api.interceptors.request.use(
  async config => {
    const token = await getToken();
    if (token) {
      config.headers = {
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  error => {
    Promise.reject(error);
  },
);

api.interceptors.response.use(
  function (response) {
    return response;
    //Trata as mensagens de erro recebidas da API
  },
  function (error) {
    let newError = Object.assign({}, error);

    //Verifica se o error é do tipo 400
    if (newError.response.status === 400) {
      if (
        newError.response.headers['content-type'].includes(
          'application/problem+json',
        )
      ) {
        newError.response.data.hasValidationErrors = true;
        /* newError.response.data.errors = errorsLowerCamelCase; */
      }
    }
    return Promise.reject(newError);
  },
);

export default api;
