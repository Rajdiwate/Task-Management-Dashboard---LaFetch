import { Endpoints } from '@/constants';
import { rtkBaseQuery } from '@/utils/rtk';
import { createApi } from '@reduxjs/toolkit/query/react';
import type { ITask } from './taskApi.types';

export const taskApi = createApi({
  reducerPath: 'taskApi',
  baseQuery: rtkBaseQuery(),
  tagTypes: ['task'],
  endpoints: (builder) => ({
    getAllTasks: builder.query<ITask[], { search?: string; page?: number; limit?: number }>({
      query: ({ search, page = 1, limit = 10 }) => ({
        url: Endpoints.TASK.GET_TASKS,
        method: 'GET',
        params: {
          q: search,
          _page: page,
          _limit: limit,
        },
      }),
      providesTags: ['task'],
    }),
    getTaskById: builder.query<ITask, string>({
      query: (id) => ({
        url: `${Endpoints.TASK.GET_TASK_BY_ID}/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'task', id }],
    }),
    createTask: builder.mutation<ITask, Partial<ITask>>({
      query: (data) => ({
        url: Endpoints.TASK.CREATE_TASK,
        method: 'POST',
        data,
      }),
      invalidatesTags: ['task'],
    }),
    editTaskById: builder.mutation<ITask, { id: string; data: Partial<ITask> }>({
      query: ({ id, data }) => ({
        url: `${Endpoints.TASK.EDIT_TASK}/${id}`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'task', id }, 'task'],
    }),
  }),
});

export const {
  useGetAllTasksQuery,
  useGetTaskByIdQuery,
  useCreateTaskMutation,
  useEditTaskByIdMutation,
} = taskApi;
