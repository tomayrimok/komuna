import axios from 'axios';
import Cookies from 'js-cookie';

export const API = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API error:', error);
    return Promise.reject(error);
  }
);

export const setAuthToken = (token: string) => {
  if (token) {
    API.interceptors.request.use(
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
    delete API.defaults.headers.common['Authorization'];
  }
};
