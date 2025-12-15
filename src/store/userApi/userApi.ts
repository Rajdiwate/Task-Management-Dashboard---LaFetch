import { Endpoints, StorageKeys } from '@/constants';
import { rtkBaseQuery } from '@/utils/rtk';
import { createApi } from '@reduxjs/toolkit/query/react';
import { setCookie } from '@/utils/cookie';
import type { User } from './userApi.types';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: rtkBaseQuery(),
  tagTypes: ['user'],
  endpoints: (builder) => ({
    login: builder.mutation<User, { username: string; password: string }>({
      query: (data) => ({
        url: Endpoints.USER.LOGIN,
        method: 'GET',
        params: { username: data.username },
      }),
      transformResponse: (response: User[]) => {
        const user = response[0];
        const authToken = user.token;
        setCookie(StorageKeys.AUTH_TOKEN, authToken);
        return user;
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const { data: user } = await queryFulfilled;
        dispatch(userApi.util.upsertQueryData('getUser', undefined, user));
      },
      invalidatesTags: ['user'],
    }),
    getUser: builder.query<User, void>({
      query: () => ({
        url: `${Endpoints.USER.GET_USER}/1`, // Hardcoded ID 1 for now as per db.json
        method: 'GET',
      }),
      providesTags: ['user'],
    }),
    getAllUsers: builder.query<User[], void>({
      query: () => ({
        url: Endpoints.USER.GET_USER,
        method: 'GET',
      }),
      providesTags: ['user'],
    }),
  }),
});

export const { useLoginMutation, useGetUserQuery, useGetAllUsersQuery } = userApi;
