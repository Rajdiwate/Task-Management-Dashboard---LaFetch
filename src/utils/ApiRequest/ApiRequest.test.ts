import { describe, it, expect, vi, beforeEach, type MockedFunction } from 'vitest';
import { type AxiosResponse } from 'axios';
import { axiosInstance } from '../axios';
import { ApiRequest } from './ApiRequest';

// Mock the axios instance
vi.mock('../axios', () => ({
  axiosInstance: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

// Type the mocked axios instance
const mockedAxios = axiosInstance as unknown as {
  get: MockedFunction<() => Partial<AxiosResponse>>;
  post: MockedFunction<() => Partial<AxiosResponse>>;
  put: MockedFunction<() => Partial<AxiosResponse>>;
  patch: MockedFunction<() => Partial<AxiosResponse>>;
  delete: MockedFunction<() => Partial<AxiosResponse>>;
};

describe('ApiRequest - GET method', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should make a GET request with params and headers', async () => {
    const mockResponse: Partial<AxiosResponse> = {
      data: { id: 1, name: 'John Doe', email: 'john@example.com' },
      status: 200,
    };
    mockedAxios.get.mockResolvedValue(mockResponse);

    const result = await ApiRequest.get<{ id: number; name: string; email: string }>(
      '/api/users/1',
      {
        params: { include: 'profile', fields: 'name,email' },
        headers: { Authorization: 'Bearer token123', Accept: 'application/json' },
      },
    );

    expect(mockedAxios.get).toHaveBeenCalledWith('/api/users/1', {
      params: { include: 'profile', fields: 'name,email' },
      headers: { Authorization: 'Bearer token123', Accept: 'application/json' },
    });
    expect(result).toEqual({ id: 1, name: 'John Doe', email: 'john@example.com' });
  });

  it('should make a GET request with only params', async () => {
    const mockResponse: Partial<AxiosResponse> = {
      data: { users: [], total: 0 },
      status: 200,
    };
    mockedAxios.get.mockResolvedValue(mockResponse);

    const result = await ApiRequest.get('/api/users', {
      params: { page: '1', limit: '10', sort: 'created_at' },
    });

    expect(mockedAxios.get).toHaveBeenCalledWith('/api/users', {
      params: { page: '1', limit: '10', sort: 'created_at' },
      headers: undefined,
    });
    expect(result).toEqual({ users: [], total: 0 });
  });

  it('should make a GET request with only headers', async () => {
    const mockResponse: Partial<AxiosResponse> = {
      data: { status: 'healthy', timestamp: '2023-01-01T00:00:00Z' },
      status: 200,
    };
    mockedAxios.get.mockResolvedValue(mockResponse);

    const result = await ApiRequest.get('/api/health', {
      headers: { 'X-API-Key': 'secret-key', 'User-Agent': 'MyApp/1.0' },
    });

    expect(mockedAxios.get).toHaveBeenCalledWith('/api/health', {
      params: undefined,
      headers: { 'X-API-Key': 'secret-key', 'User-Agent': 'MyApp/1.0' },
    });
    expect(result).toEqual({ status: 'healthy', timestamp: '2023-01-01T00:00:00Z' });
  });

  it('should make a GET request without params and headers', async () => {
    const mockResponse: Partial<AxiosResponse> = {
      data: { message: 'Welcome to the API' },
      status: 200,
    };
    mockedAxios.get.mockResolvedValue(mockResponse);

    const result = await ApiRequest.get('/api/welcome');

    expect(mockedAxios.get).toHaveBeenCalledWith('/api/welcome', {
      params: undefined,
      headers: undefined,
    });
    expect(result).toEqual({ message: 'Welcome to the API' });
  });

  it('should handle empty response data', async () => {
    const mockResponse: Partial<AxiosResponse> = {
      data: null,
      status: 200,
    };
    mockedAxios.get.mockResolvedValue(mockResponse);

    const result = await ApiRequest.get('/api/empty');

    expect(mockedAxios.get).toHaveBeenCalledWith('/api/empty', {
      params: undefined,
      headers: undefined,
    });
    expect(result).toBeNull();
  });

  it('should handle complex nested response data', async () => {
    const mockResponse: Partial<AxiosResponse> = {
      data: {
        user: {
          id: 1,
          profile: { name: 'John', avatar: 'avatar.jpg' },
          preferences: { theme: 'dark', notifications: true },
        },
        meta: { version: '1.0', timestamp: '2023-01-01' },
      },
      status: 200,
    };
    mockedAxios.get.mockResolvedValue(mockResponse);

    const result = await ApiRequest.get('/api/user/profile', {
      params: { detailed: 'true' },
    });

    expect(mockedAxios.get).toHaveBeenCalledWith('/api/user/profile', {
      params: { detailed: 'true' },
      headers: undefined,
    });
    expect(result).toEqual({
      user: {
        id: 1,
        profile: { name: 'John', avatar: 'avatar.jpg' },
        preferences: { theme: 'dark', notifications: true },
      },
      meta: { version: '1.0', timestamp: '2023-01-01' },
    });
  });

  it('should return correctly typed response with generic type', async () => {
    interface ApiResponse {
      data: Array<{ id: number; title: string }>;
      pagination: { page: number; total: number };
    }

    const mockResponse: Partial<AxiosResponse> = {
      data: {
        data: [
          { id: 1, title: 'First Post' },
          { id: 2, title: 'Second Post' },
        ],
        pagination: { page: 1, total: 2 },
      },
      status: 200,
    };
    mockedAxios.get.mockResolvedValue(mockResponse);

    const result = await ApiRequest.get<ApiResponse>('/api/posts');

    expect(result.data).toHaveLength(2);
    expect(result.data[0].id).toBe(1);
    expect(result.data[0].title).toBe('First Post');
    expect(result.pagination.total).toBe(2);
  });

  describe('Error handling for GET requests', () => {
    it('should log and re-throw network errors', async () => {
      const mockError = new Error('Network Error');
      mockedAxios.get.mockRejectedValue(mockError);

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      await expect(ApiRequest.get('/api/users')).rejects.toThrow('Network Error');
      expect(consoleSpy).toHaveBeenCalledWith(mockError);

      consoleSpy.mockRestore();
    });

    it('should handle 404 Not Found errors', async () => {
      const mockError = {
        response: {
          status: 404,
          statusText: 'Not Found',
          data: { message: 'User not found', code: 'USER_NOT_FOUND' },
        },
      };
      mockedAxios.get.mockRejectedValue(mockError);

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      await expect(
        ApiRequest.get('/api/users/999', {
          headers: { Authorization: 'Bearer token' },
        }),
      ).rejects.toEqual(mockError);
      expect(consoleSpy).toHaveBeenCalledWith(mockError);

      consoleSpy.mockRestore();
    });

    it('should handle 401 Unauthorized errors', async () => {
      const mockError = {
        response: {
          status: 401,
          statusText: 'Unauthorized',
          data: { message: 'Invalid token' },
        },
      };
      mockedAxios.get.mockRejectedValue(mockError);

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      await expect(
        ApiRequest.get('/api/protected', {
          headers: { Authorization: 'Bearer invalid-token' },
        }),
      ).rejects.toEqual(mockError);
      expect(consoleSpy).toHaveBeenCalledWith(mockError);

      consoleSpy.mockRestore();
    });

    it('should handle 500 Internal Server Error', async () => {
      const mockError = {
        response: {
          status: 500,
          statusText: 'Internal Server Error',
          data: { error: 'Database connection failed' },
        },
      };
      mockedAxios.get.mockRejectedValue(mockError);

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      await expect(
        ApiRequest.get('/api/users', {
          params: { include: 'all' },
        }),
      ).rejects.toEqual(mockError);
      expect(consoleSpy).toHaveBeenCalledWith(mockError);

      consoleSpy.mockRestore();
    });

    it('should handle timeout errors', async () => {
      const mockError = {
        code: 'ECONNABORTED',
        message: 'timeout of 5000ms exceeded',
      };
      mockedAxios.get.mockRejectedValue(mockError);

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      await expect(ApiRequest.get('/api/slow-endpoint')).rejects.toEqual(mockError);
      expect(consoleSpy).toHaveBeenCalledWith(mockError);

      consoleSpy.mockRestore();
    });
  });
});

describe('ApiRequest - POST method', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should make a POST request with body, params and headers', async () => {
    const mockResponse: Partial<AxiosResponse> = {
      data: { id: 1, name: 'John Doe', email: 'john@example.com' },
      status: 201,
    };
    mockedAxios.post.mockResolvedValue(mockResponse);

    const body = { name: 'John Doe', email: 'john@example.com' };
    const result = await ApiRequest.post<{ id: number; name: string; email: string }>(
      '/api/users',
      body,
      {
        params: { notify: 'true' },
        headers: { Authorization: 'Bearer token123', 'Content-Type': 'application/json' },
      },
    );

    expect(mockedAxios.post).toHaveBeenCalledWith('/api/users', body, {
      params: { notify: 'true' },
      headers: { Authorization: 'Bearer token123', 'Content-Type': 'application/json' },
    });
    expect(result).toEqual({ id: 1, name: 'John Doe', email: 'john@example.com' });
  });

  it('should make a POST request with only body', async () => {
    const mockResponse: Partial<AxiosResponse> = {
      data: { id: 2, message: 'Created successfully' },
      status: 201,
    };
    mockedAxios.post.mockResolvedValue(mockResponse);

    const body = { title: 'New Post', content: 'Post content' };
    const result = await ApiRequest.post('/api/posts', body);

    expect(mockedAxios.post).toHaveBeenCalledWith('/api/posts', body, {
      params: undefined,
      headers: undefined,
    });
    expect(result).toEqual({ id: 2, message: 'Created successfully' });
  });

  it('should make a POST request without body', async () => {
    const mockResponse: Partial<AxiosResponse> = {
      data: { success: true },
      status: 200,
    };
    mockedAxios.post.mockResolvedValue(mockResponse);

    const result = await ApiRequest.post('/api/trigger');

    expect(mockedAxios.post).toHaveBeenCalledWith('/api/trigger', undefined, {
      params: undefined,
      headers: undefined,
    });
    expect(result).toEqual({ success: true });
  });
});

describe('ApiRequest - PUT method', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should make a PUT request with body and options', async () => {
    const mockResponse: Partial<AxiosResponse> = {
      data: { id: 1, name: 'Updated Name', email: 'updated@example.com' },
      status: 200,
    };
    mockedAxios.put.mockResolvedValue(mockResponse);

    const body = { name: 'Updated Name', email: 'updated@example.com' };
    const result = await ApiRequest.put('/api/users/1', body, {
      headers: { Authorization: 'Bearer token123' },
    });

    expect(mockedAxios.put).toHaveBeenCalledWith('/api/users/1', body, {
      params: undefined,
      headers: { Authorization: 'Bearer token123' },
    });
    expect(result).toEqual({ id: 1, name: 'Updated Name', email: 'updated@example.com' });
  });
});

describe('ApiRequest - PATCH method', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should make a PATCH request with body and options', async () => {
    const mockResponse: Partial<AxiosResponse> = {
      data: { id: 1, email: 'newemail@example.com' },
      status: 200,
    };
    mockedAxios.patch.mockResolvedValue(mockResponse);

    const body = { email: 'newemail@example.com' };
    const result = await ApiRequest.patch('/api/users/1', body, {
      headers: { Authorization: 'Bearer token123' },
    });

    expect(mockedAxios.patch).toHaveBeenCalledWith('/api/users/1', body, {
      params: undefined,
      headers: { Authorization: 'Bearer token123' },
    });
    expect(result).toEqual({ id: 1, email: 'newemail@example.com' });
  });
});

describe('ApiRequest - DELETE method', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should make a DELETE request with params and headers', async () => {
    const mockResponse: Partial<AxiosResponse> = {
      data: { message: 'User deleted successfully' },
      status: 200,
    };
    mockedAxios.delete.mockResolvedValue(mockResponse);

    const result = await ApiRequest.delete('/api/users/1', {
      params: { force: 'true' },
      headers: { Authorization: 'Bearer token123' },
    });

    expect(mockedAxios.delete).toHaveBeenCalledWith('/api/users/1', {
      params: { force: 'true' },
      headers: { Authorization: 'Bearer token123' },
    });
    expect(result).toEqual({ message: 'User deleted successfully' });
  });

  it('should make a DELETE request without options', async () => {
    const mockResponse: Partial<AxiosResponse> = {
      data: null,
      status: 204,
    };
    mockedAxios.delete.mockResolvedValue(mockResponse);

    const result = await ApiRequest.delete('/api/users/1');

    expect(mockedAxios.delete).toHaveBeenCalledWith('/api/users/1', {
      params: undefined,
      headers: undefined,
    });
    expect(result).toBeNull();
  });
});
