import { describe, it, expect, vi, beforeEach, type MockedFunction } from 'vitest';
import { type AxiosError, type AxiosResponse, type AxiosRequestConfig, AxiosHeaders } from 'axios';
import { rtkBaseQuery, type BaseResponse, type BaseErrorResponse } from './rtkBaseQuery';
import { axiosInstance } from '../axios';
import type { BaseQueryApi } from '@reduxjs/toolkit/query';

// Mock the axios instance
vi.mock('../axios', () => ({
  axiosInstance: vi.fn(),
}));

const mockedAxiosInstance = axiosInstance as unknown as MockedFunction<typeof axiosInstance>;

// Helper function to create mock response with BaseResponse structure
const createMockResponse = <T>(data: T, status = 200): Partial<AxiosResponse<BaseResponse<T>>> => ({
  data: {
    statusCode: status,
    data,
    message: 'Success',
    success: true,
  },
  status,
  statusText: 'OK',
  headers: {},
  config: { headers: new AxiosHeaders() },
});

// Helper function to create mock error with BaseErrorResponse structure
const createMockError = (
  message: string,
  status?: number,
  data?: unknown,
): Partial<AxiosError<BaseErrorResponse>> => {
  const mockHeaders = new AxiosHeaders();

  return {
    name: 'AxiosError',
    message,
    isAxiosError: true,
    response: status
      ? {
          status,
          statusText: 'Error',
          headers: {},
          config: {
            url: '',
            method: 'get',
            headers: mockHeaders,
          },
          data: {
            statusCode: status,
            message,
            success: false,
            data,
            // ...(data && { data }),
          },
        }
      : undefined,
  };
};

describe('rtkBaseQuery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('successful requests', () => {
    it('should return data on successful request with all parameters', async () => {
      const mockResponseData = { id: 1, name: 'test' };
      const mockResponse = createMockResponse(mockResponseData);

      mockedAxiosInstance.mockResolvedValueOnce(mockResponse as AxiosResponse);

      const baseQuery = rtkBaseQuery();
      const result = await baseQuery(
        {
          url: '/users',
          method: 'POST',
          data: { name: 'John' },
          params: { page: 1 },
          headers: { 'Content-Type': 'application/json' },
        },
        {} as BaseQueryApi,
        {},
      );

      expect(result).toEqual({
        data: mockResponseData,
      });

      expect(mockedAxiosInstance).toHaveBeenCalledWith({
        url: '/users',
        method: 'POST',
        data: { name: 'John' },
        params: { page: 1 },
        headers: { 'Content-Type': 'application/json' },
      });
    });

    it('should handle GET request with only required parameters', async () => {
      const mockResponseData: unknown[] = [];
      const mockResponse = createMockResponse(mockResponseData);

      mockedAxiosInstance.mockResolvedValueOnce(mockResponse as AxiosResponse);

      const baseQuery = rtkBaseQuery({ baseUrl: '/api' });
      const result = await baseQuery(
        {
          url: '/items',
          method: 'GET',
        },
        {} as BaseQueryApi,
        {},
      );

      expect(result).toEqual({
        data: mockResponseData,
      });

      expect(mockedAxiosInstance).toHaveBeenCalledWith({
        url: '/api/items',
        method: 'GET',
      });
    });
  });

  describe('error handling', () => {
    it('should handle axios error with response', async () => {
      const errorMessage = 'User not found';
      const errorData = { field: 'id', code: 'not_found' };
      const mockError = createMockError(errorMessage, 404, errorData);

      mockedAxiosInstance.mockRejectedValueOnce(mockError as AxiosError);

      const baseQuery = rtkBaseQuery({ baseUrl: '' });
      const result = await baseQuery(
        {
          url: '/nonexistent',
          method: 'GET',
        },
        {} as BaseQueryApi,
        {},
      );

      expect(result).toEqual({
        error: errorMessage,
      });
    });

    it('should handle axios error without response (network error)', async () => {
      const errorMessage = 'Network Error';
      const mockError = createMockError(errorMessage);

      mockedAxiosInstance.mockRejectedValueOnce(mockError as AxiosError);

      const baseQuery = rtkBaseQuery({ baseUrl: '' });
      const result = await baseQuery(
        {
          url: '/test',
          method: 'POST',
          data: { test: true },
        },
        {} as BaseQueryApi,
        {},
      );

      expect(result).toEqual({
        error: errorMessage,
      });
    });

    it('should handle different HTTP error status codes', async () => {
      const testCases = [
        { status: 400, message: 'Bad Request' },
        { status: 401, message: 'Unauthorized' },
        { status: 403, message: 'Forbidden' },
        { status: 422, message: 'Validation failed' },
        { status: 500, message: 'Server Error' },
      ] as const;

      for (const testCase of testCases) {
        const mockError = createMockError(testCase.message, testCase.status);

        mockedAxiosInstance.mockRejectedValueOnce(mockError as AxiosError);

        const baseQuery = rtkBaseQuery({ baseUrl: '/api' });
        const result = await baseQuery(
          {
            url: '/test',
            method: 'POST',
          },
          {} as BaseQueryApi,
          {},
        );

        expect(result).toEqual({
          error: testCase.message,
        });
      }
    });
  });

  describe('different HTTP methods', () => {
    const methods: Array<AxiosRequestConfig['method']> = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

    methods.forEach((method) => {
      it(`should handle ${method} requests correctly`, async () => {
        const mockResponseData = { method, success: true };
        const mockResponse = createMockResponse(mockResponseData);

        mockedAxiosInstance.mockResolvedValueOnce(mockResponse as AxiosResponse);

        const baseQuery = rtkBaseQuery();
        const requestData = method !== 'GET' ? { test: true } : undefined;

        const result = await baseQuery(
          {
            url: '/endpoint',
            method,
            ...(requestData && { data: requestData }),
          },
          {} as BaseQueryApi,
          {},
        );

        expect(result).toEqual({
          data: mockResponseData,
        });

        expect(mockedAxiosInstance).toHaveBeenCalledWith({
          url: '/endpoint',
          method,
          ...(requestData && { data: requestData }),
        });
      });
    });
  });

  describe('type safety', () => {
    it('should work with typed result', async () => {
      interface User {
        id: number;
        name: string;
        email: string;
      }

      const mockUserData: User = { id: 1, name: 'John', email: 'john@example.com' };
      const mockResponse = createMockResponse(mockUserData);

      mockedAxiosInstance.mockResolvedValueOnce(mockResponse as AxiosResponse);

      const baseQuery = rtkBaseQuery<User>();
      const result = await baseQuery(
        {
          url: '/users/1',
          method: 'GET',
        },
        {} as BaseQueryApi,
        {},
      );

      expect(result).toEqual({
        data: mockUserData,
      });
    });
  });

  describe('edge cases', () => {
    it('should handle null data in error response', async () => {
      const errorMessage = 'Timeout';
      const mockError = createMockError(errorMessage, 408);

      mockedAxiosInstance.mockRejectedValueOnce(mockError as AxiosError);

      const baseQuery = rtkBaseQuery();
      const result = await baseQuery(
        {
          url: '/timeout',
          method: 'GET',
        },
        {} as BaseQueryApi,
        {},
      );

      expect(result).toEqual({
        error: errorMessage,
      });
    });

    it('should handle empty response data', async () => {
      const mockResponse = createMockResponse(null);

      mockedAxiosInstance.mockResolvedValueOnce(mockResponse as AxiosResponse);

      const baseQuery = rtkBaseQuery();
      const result = await baseQuery(
        {
          url: '/empty',
          method: 'DELETE',
        },
        {} as BaseQueryApi,
        {},
      );

      expect(result).toEqual({
        data: null,
      });
    });

    it('should concatenate baseUrl and url correctly', async () => {
      const testCases = [
        { baseUrl: 'https://api.com', url: '/users', expected: 'https://api.com/users' },
        { baseUrl: 'https://api.com/', url: '/users', expected: 'https://api.com//users' },
        { baseUrl: 'https://api.com', url: 'users', expected: 'https://api.comusers' },
        { baseUrl: '', url: '/users', expected: '/users' },
        { baseUrl: '/api', url: '/users', expected: '/api/users' },
      ] as const;

      for (const testCase of testCases) {
        const mockResponse = createMockResponse('success');

        mockedAxiosInstance.mockResolvedValueOnce(mockResponse as AxiosResponse);

        const baseQuery = rtkBaseQuery({ baseUrl: testCase.baseUrl });
        await baseQuery(
          {
            url: testCase.url,
            method: 'GET',
          },
          {} as BaseQueryApi,
          {},
        );

        expect(mockedAxiosInstance).toHaveBeenCalledWith(
          expect.objectContaining({
            url: testCase.expected,
          }),
        );
      }
    });
  });
});
