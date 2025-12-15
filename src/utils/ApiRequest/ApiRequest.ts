import { axiosInstance } from '../axios';

export type TRequestOptions = {
  body?: object;
  params?: Record<string, string>;
  headers?: Record<string, string>;
};

export type TSendRequest = {
  method: 'get' | 'post' | 'put' | 'patch' | 'delete';
  body?: object;
  params?: Record<string, string>;
  headers?: Record<string, string>;
  url: string;
};

export class ApiRequest {
  private static async sendRequest<T>({
    method,
    body,
    params,
    headers,
    url,
  }: TSendRequest): Promise<T> {
    try {
      const config = { params, headers };

      let response;
      if (method === 'get' || method === 'delete') {
        response = await axiosInstance[method](url, config);
      } else {
        response = await axiosInstance[method](url, body, config);
      }

      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async get<T>(url: string, options?: Omit<TRequestOptions, 'body'>): Promise<T> {
    return this.sendRequest<T>({
      method: 'get',
      url,
      ...options,
    });
  }

  static async post<T>(
    url: string,
    body?: object,
    options?: Omit<TRequestOptions, 'body'>,
  ): Promise<T> {
    return this.sendRequest<T>({
      method: 'post',
      url,
      body,
      ...options,
    });
  }

  static async put<T>(
    url: string,
    body?: object,
    options?: Omit<TRequestOptions, 'body'>,
  ): Promise<T> {
    return this.sendRequest<T>({
      method: 'put',
      url,
      body,
      ...options,
    });
  }

  static async patch<T>(
    url: string,
    body?: object,
    options?: Omit<TRequestOptions, 'body'>,
  ): Promise<T> {
    return this.sendRequest<T>({
      method: 'patch',
      url,
      body,
      ...options,
    });
  }

  static async delete<T>(url: string, options?: Omit<TRequestOptions, 'body'>): Promise<T> {
    return this.sendRequest<T>({
      method: 'delete',
      url,
      ...options,
    });
  }
}
