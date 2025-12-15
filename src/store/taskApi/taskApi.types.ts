import type { User } from '../userApi/userApi.types';

export interface ITask {
  id: string;
  title: string;
  description: string;
  status: string;
  user: User;
  date: string;
}

export interface IPaginatedTasks {
  items: ITask[];
  page: number;
  limit: number;
  total: number;
}
