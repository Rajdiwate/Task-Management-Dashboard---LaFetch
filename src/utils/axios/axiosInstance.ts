import axios, { type CreateAxiosDefaults, type AxiosRequestHeaders } from 'axios';
import { API_BASE_URL, StorageKeys } from '@/constants';
import { readCookie } from '../cookie';
import { toast } from 'react-toastify';

const axiosConfig: CreateAxiosDefaults = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
};

export const axiosInstance = axios.create(axiosConfig); // custom axios instance

axiosInstance.interceptors.request.use(
  (config) => {
    const token = readCookie(StorageKeys.AUTH_TOKEN);
    if (token) {
      // Ensure config.headers exists and is an object
      if (!config.headers) {
        config.headers = {} as AxiosRequestHeaders;
      }
      // Alternative: config.headers = config.headers || {};

      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    throw error;
  },
);

// API global error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    let errorMessage = 'Something went wrong. Please try again.';

    if (axios.isAxiosError(error)) {
      // If server responded with a message
      if (error.response?.data?.data && typeof error.response.data.data === 'string') {
        errorMessage = error.response.data.data;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    toast.error(errorMessage); // show toast globally

    // Return null so component can continue without try-catch
    return Promise.reject(null);
  },
);
