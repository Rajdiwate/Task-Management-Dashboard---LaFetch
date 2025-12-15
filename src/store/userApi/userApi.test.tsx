import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import type { ReactNode } from 'react';
import { Endpoints, StorageKeys, USER_ROLE } from '@/constants';
import type { RootState } from '@/store/store';

// Mock axios instance
const mockAxiosInstance = vi.fn();

// Use vi.hoisted to define variables that will be used in mocks
const { mockSetCookie } = vi.hoisted(() => ({
  mockSetCookie: vi.fn(),
}));

// Mock dependencies
vi.mock('@/utils/cookie', () => ({
  setCookie: mockSetCookie,
}));

// Mock the axios instance
vi.mock('@/utils/axios', () => ({
  axiosInstance: mockAxiosInstance,
}));

// Global unhandled rejection handler for tests
const originalHandler = process.listeners('unhandledRejection');
beforeAll(() => {
  process.removeAllListeners('unhandledRejection');
  process.on('unhandledRejection', (reason) => {
    // Only ignore RTK Query related unhandled rejections in tests
    if (reason && typeof reason === 'object' && 'error' in reason && 'isUnhandledError' in reason) {
      // This is an RTK Query mutation error, ignore in tests
      return;
    }
    // Re-throw other unhandled rejections
    throw reason;
  });
});

afterAll(() => {
  process.removeAllListeners('unhandledRejection');
  originalHandler.forEach((handler) => {
    process.on('unhandledRejection', handler);
  });
});

// Import after mocks are set up
const { userApi } = await import('./userApi');

describe('userApi Configuration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should have correct reducerPath', () => {
    expect(userApi.reducerPath).toBe('auth');
  });

  it('should have required endpoints', () => {
    expect(userApi.endpoints.login).toBeDefined();
    expect(userApi.endpoints.getUser).toBeDefined();
    expect(userApi.endpoints.userSignup).toBeDefined();
    expect(userApi.endpoints.getAllBusinessUsersByRole).toBeDefined();
  });

  it('should export hooks', () => {
    const {
      useLoginMutation,
      useGetUserQuery,
      useUserSignupMutation,
      useGetAllBusinessUsersByRoleQuery,
    } = userApi;
    expect(useLoginMutation).toBeDefined();
    expect(useGetUserQuery).toBeDefined();
    expect(useUserSignupMutation).toBeDefined();
    expect(useGetAllBusinessUsersByRoleQuery).toBeDefined();
  });
});

describe('userApi Endpoints', () => {
  let store: ReturnType<typeof configureStore>;

  const createTestStore = () => {
    return configureStore({
      reducer: {
        [userApi.reducerPath]: userApi.reducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false,
        }).concat(userApi.middleware),
    });
  };

  const createWrapper = (testStore: ReturnType<typeof configureStore>) => {
    return ({ children }: { children: ReactNode }) => (
      <Provider store={testStore}>{children}</Provider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    store = createTestStore();
  });

  afterEach(async () => {
    // Clean up RTK Query state
    store.dispatch(userApi.util.resetApiState());

    // Wait for cleanup
    await new Promise((resolve) => setTimeout(resolve, 50));
  });

  describe('login mutation', () => {
    it('should make POST request to login endpoint and handle onQueryStarted', async () => {
      const mockLoginData = { username: 'testuser', password: 'password123' };
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        roleName: 'user',
      };

      const mockApiResponse = {
        statusCode: 200,
        data: {
          user: mockUser,
          authToken: 'mock-auth-token-123',
        },
        message: 'Login successful',
        success: true,
      };

      mockAxiosInstance.mockResolvedValueOnce({
        data: mockApiResponse,
      });

      const { result, unmount } = renderHook(() => userApi.useLoginMutation(), {
        wrapper: createWrapper(store),
      });

      const [loginMutation] = result.current;

      try {
        const loginResult = await loginMutation(mockLoginData).unwrap();

        expect(mockAxiosInstance).toHaveBeenCalledWith({
          url: Endpoints.USER.LOGIN,
          method: 'POST',
          data: mockLoginData,
          params: undefined,
          headers: undefined,
        });

        expect(loginResult).toEqual(mockUser);
        expect(mockSetCookie).toHaveBeenCalledWith(StorageKeys.AUTH_TOKEN, 'mock-auth-token-123');

        // Wait for onQueryStarted to complete
        await waitFor(
          () => {
            const cachedUserData = (store.getState() as RootState)[userApi.reducerPath].queries[
              'getUser(undefined)'
            ];
            expect(cachedUserData?.data).toEqual(mockUser);
          },
          { timeout: 1000 },
        );
      } finally {
        unmount();
      }
    });

    it('should handle login error correctly', async () => {
      const mockLoginData = { username: 'testuser', password: 'wrongpassword' };

      const mockAxiosError = {
        response: {
          data: {
            statusCode: 401,
            message: 'Invalid credentials',
            success: false,
          },
        },
        message: 'Request failed with status code 401',
      };

      mockAxiosInstance.mockRejectedValueOnce(mockAxiosError);

      const { result, unmount } = renderHook(() => userApi.useLoginMutation(), {
        wrapper: createWrapper(store),
      });

      const [loginMutation] = result.current;

      try {
        // Test the error case without trying to handle the onQueryStarted promise
        await expect(loginMutation(mockLoginData).unwrap()).rejects.toEqual('Invalid credentials');

        expect(mockSetCookie).not.toHaveBeenCalled();

        // Verify cache was not updated
        const cachedUserData = (store.getState() as RootState)[userApi.reducerPath].queries[
          'getUser(undefined)'
        ];
        expect(cachedUserData).toBeUndefined();

        // Wait a bit for any background processes to complete
        await new Promise((resolve) => setTimeout(resolve, 100));
      } finally {
        unmount();
      }
    });
  });

  describe('userSignup mutation', () => {
    it('should handle signup error correctly', async () => {
      const mockSignupData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'wrongpassword',
        phoneNumber: '1234567890',
        firstName: 'Test',
        lastName: 'User',
        roleName: USER_ROLE.CONSUMER,
      };

      const mockAxiosError = {
        response: {
          data: {
            statusCode: 400,
            message: 'User already exists',
            success: false,
          },
        },
        message: 'Request failed with status code 400',
      };

      mockAxiosInstance.mockRejectedValueOnce(mockAxiosError);

      const { result, unmount } = renderHook(() => userApi.useUserSignupMutation(), {
        wrapper: createWrapper(store),
      });

      const [signupMutation] = result.current;

      try {
        // Test the error case without trying to handle the onQueryStarted promise
        await expect(signupMutation(mockSignupData).unwrap()).rejects.toEqual(
          'User already exists',
        );

        expect(mockSetCookie).not.toHaveBeenCalled();

        // Verify cache was not updated
        const cachedUserData = (store.getState() as RootState)[userApi.reducerPath].queries[
          'getUser(undefined)'
        ];
        expect(cachedUserData).toBeUndefined();

        // Wait a bit for any background processes to complete
        await new Promise((resolve) => setTimeout(resolve, 100));
      } finally {
        unmount();
      }
    });
  });

  describe('getUser query', () => {
    it('should make GET request to user endpoint', async () => {
      const mockUser = {
        id: 1,
        username: 'currentuser',
        email: 'current@example.com',
        roleName: 'user',
      };

      const mockApiResponse = {
        statusCode: 200,
        data: mockUser,
        message: 'User fetched successfully',
        success: true,
      };

      mockAxiosInstance.mockResolvedValueOnce({
        data: mockApiResponse,
      });

      const { result, unmount } = renderHook(() => userApi.useGetUserQuery(), {
        wrapper: createWrapper(store),
      });

      try {
        await waitFor(
          () => {
            expect(result.current.isSuccess).toBe(true);
          },
          { timeout: 2000 },
        );

        expect(mockAxiosInstance).toHaveBeenCalledWith({
          url: Endpoints.USER.GET_USER,
          method: 'GET',
          data: undefined,
          params: undefined,
          headers: undefined,
        });

        expect(result.current.data).toEqual(mockUser);
      } finally {
        unmount();
      }
    });

    it('should handle user query error', async () => {
      const mockAxiosError = {
        response: {
          data: {
            statusCode: 401,
            message: 'Unauthorized',
            success: false,
          },
        },
        message: 'Request failed with status code 401',
      };

      mockAxiosInstance.mockRejectedValueOnce(mockAxiosError);

      const { result, unmount } = renderHook(() => userApi.useGetUserQuery(), {
        wrapper: createWrapper(store),
      });

      try {
        await waitFor(
          () => {
            expect(result.current.isError).toBe(true);
          },
          { timeout: 2000 },
        );

        expect(result.current.error).toEqual('Unauthorized');
      } finally {
        unmount();
      }
    });
  });

  describe('getAllBusinessUsersByRole query', () => {
    it('should make GET request to get business users by role', async () => {
      const mockUsers = [
        { id: 1, username: 'business1' },
        { id: 2, username: 'business2' },
      ];

      const mockApiResponse = {
        statusCode: 200,
        data: {
          items: mockUsers,
          total: 2,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
        message: 'Success',
        success: true,
      };

      mockAxiosInstance.mockResolvedValueOnce({ data: mockApiResponse });

      const { result, unmount } = renderHook(
        () => userApi.useGetAllBusinessUsersByRoleQuery({ role: USER_ROLE.BUSINESS_MANAGER }),
        {
          wrapper: createWrapper(store),
        },
      );

      try {
        expect(result.current.isLoading).toBe(true);

        await waitFor(
          () => {
            expect(result.current.isSuccess).toBe(true);
          },
          { timeout: 2000 },
        );

        expect(mockAxiosInstance).toHaveBeenCalledWith({
          url: `${Endpoints.USER.GET_BUSINESS_USERS}/${USER_ROLE.BUSINESS_MANAGER}`,
          method: 'GET',
          data: undefined,
          params: {
            search: undefined,
          },
          headers: undefined,
        });

        expect(result.current.data).toEqual(mockUsers);
      } finally {
        unmount();
      }
    });

    it('should include search param when provided', async () => {
      const searchTerm = 'test';
      const mockApiResponse = {
        statusCode: 200,
        data: {
          items: [{ id: 1, username: 'testbusiness' }],
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
        message: 'Success',
        success: true,
      };

      mockAxiosInstance.mockResolvedValueOnce({ data: mockApiResponse });

      const { result, unmount } = renderHook(
        () =>
          userApi.useGetAllBusinessUsersByRoleQuery({
            role: USER_ROLE.BUSINESS_MANAGER,
            search: searchTerm,
          }),
        {
          wrapper: createWrapper(store),
        },
      );

      try {
        await waitFor(
          () => {
            expect(result.current.isSuccess).toBe(true);
          },
          { timeout: 2000 },
        );

        expect(mockAxiosInstance).toHaveBeenCalledWith({
          url: `${Endpoints.USER.GET_BUSINESS_USERS}/${USER_ROLE.BUSINESS_MANAGER}`,
          method: 'GET',
          data: undefined,
          params: { search: searchTerm },
          headers: undefined,
        });
      } finally {
        unmount();
      }
    });
  });
});
