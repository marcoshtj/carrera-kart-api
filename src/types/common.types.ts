import { IUserResponse } from './user.types';

export interface IAuthenticatedRequest {
  user?: IUserResponse;
  body?: any;
  params?: any;
  query?: any;
  headers?: any;
}

export interface IApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface IPaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface IApiError {
  success: false;
  message: string;
  error: string;
  statusCode: number;
}
