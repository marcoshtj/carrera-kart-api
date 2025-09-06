export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserResponse {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateUserRequest {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface IUpdateUserRequest {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  isActive?: boolean;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ILoginResponse {
  user: IUserResponse;
  token: string;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}
