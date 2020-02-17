import getConfig from 'next/config';
import axios from 'axios';
import {
  toCamelCase,
  toSnakeCase,
} from 'case-converter';

import {
  clearToken,
  getToken,
  setToken,
  tokenCloseToExpiry,
} from '@utils/jwt';

const { BACKEND_URL } = getConfig().publicRuntimeConfig;

class Request {
  constructor() {
    this.initConfig();
  }

  initConfig() {
    const token = getToken();
    const baseURL = `${BACKEND_URL}`;

    if (token) axios.defaults.headers.common.Authorization = `JWT ${token}`;

    axios.defaults.baseURL = baseURL;

    axios.interceptors.request.use(async (config) => {
      if (tokenCloseToExpiry(token)) await this.refreshToken();

      return {
        ...config,
        data: config.data ? toSnakeCase(config.data) : config.data,
        params: config.params ? toSnakeCase(config.params) : config.params,
      };
    });

    axios.interceptors.response.use(response => ({
      ...response,
      data: toCamelCase(response.data),
    }), error => Promise.reject(this.parseError(error)));
  }

  clearAuthToken() {
    clearToken();
    axios.defaults.headers.common.Authorization = '';
  }

  async refreshToken() {
    const currentToken = getToken();

    this.clearAuthToken();

    const response = await axios.post('v1/auth/jwt/refresh/', { token: currentToken });

    this.setAuthToken(response.data.token);
  }

  setAuthToken(token) {
    setToken(token);
    axios.defaults.headers.common.Authorization = `JWT ${token}`;
  }

  parseError(error) {
    const { response = {} } = error;

    return {
      ...error,
      response: {
        ...response,
        data: {
          ...toCamelCase(response.data),
          _error: response.data.non_field_errors || [],
        },
      },
    };
  }

  get(...args) {
    return axios.get(...args);
  }

  post(...args) {
    return axios.post(...args);
  }

  options(...args) {
    return axios.options(...args);
  }

  patch(...args) {
    return axios.patch(...args);
  }
}

export default new Request();
