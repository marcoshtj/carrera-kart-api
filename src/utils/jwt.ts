import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { IUserResponse } from '../types/user.types';

export interface IJwtPayload {
  userId: string;
  email: string;
  role: string;
}

export const generateToken = (user: IUserResponse): string => {
  const payload: IJwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role
  };

  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expire
  } as jwt.SignOptions);
};

export const verifyToken = (token: string): IJwtPayload => {
  try {
    return jwt.verify(token, config.jwt.secret) as IJwtPayload;
  } catch (error) {
    throw new Error('Token inválido');
  }
};
