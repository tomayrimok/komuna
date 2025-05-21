import Cookies from 'js-cookie';
import { ApiClient } from '@komuna/types';

ApiClient.setConfig({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

ApiClient.instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API error:', error);
    return Promise.reject(error);
  }
);

export const setAuthToken = (token: string) => {
  if (token) {
    ApiClient.instance.interceptors.request.use(
      (config) => {
        // Retrieve the token from cookies
        const token = Cookies.get('Authentication');

        if (token) {
          // Add Authorization header if token is available
          config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
      },
      (error) => {
        // Handle request errors
        return Promise.reject(error);
      }
    );
  } else {
    delete ApiClient.instance.defaults.headers.common['Authorization'];
  }
};
