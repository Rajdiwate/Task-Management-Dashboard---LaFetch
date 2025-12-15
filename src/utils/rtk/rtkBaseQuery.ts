import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { AxiosError, AxiosRequestConfig } from 'axios';
import { axiosInstance } from '../axios';


export interface BaseErrorResponse<ResultType = unknown> {
  statusCode: number;
  message: string;
  success: false;
  data?: ResultType;
}

export const rtkBaseQuery =
  <ResultType = unknown>(
    { baseUrl }: { baseUrl: string } = { baseUrl: '' },
  ): BaseQueryFn<
    {
      url: string;
      method: AxiosRequestConfig['method'];
      data?: AxiosRequestConfig['data'];
      params?: AxiosRequestConfig['params'];
      headers?: AxiosRequestConfig['headers'];
    },
    ResultType,
    string
  > =>
  async ({ url, method, data, params, headers }) => {
    try {
      const result = await axiosInstance<ResultType>({
        url: baseUrl + url,
        method,
        data,
        params,
        headers,
      });

      // Extract and return the data field from the response
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError<BaseErrorResponse>;

      // Return a consistent error structure
      return {
        error: err.response?.data?.message || err.message,
      };
    }
  };
