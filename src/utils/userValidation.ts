import Joi from 'joi';
import { UserRole } from '../types/user.types';

export const createUserSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'Nome deve ter pelo menos 2 caracteres',
      'string.max': 'Nome deve ter no máximo 100 caracteres',
      'any.required': 'Nome é obrigatório'
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Email deve ter um formato válido',
      'any.required': 'Email é obrigatório'
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'Senha deve ter pelo menos 6 caracteres',
      'any.required': 'Senha é obrigatória'
    }),
  role: Joi.string()
    .valid(...Object.values(UserRole))
    .default(UserRole.USER)
    .messages({
      'any.only': 'Role deve ser ADMIN ou USER'
    })
});

export const updateUserSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .messages({
      'string.min': 'Nome deve ter pelo menos 2 caracteres',
      'string.max': 'Nome deve ter no máximo 100 caracteres'
    }),
  email: Joi.string()
    .email()
    .messages({
      'string.email': 'Email deve ter um formato válido'
    }),
  password: Joi.string()
    .min(6)
    .messages({
      'string.min': 'Senha deve ter pelo menos 6 caracteres'
    }),
  role: Joi.string()
    .valid(...Object.values(UserRole))
    .messages({
      'any.only': 'Role deve ser ADMIN ou USER'
    }),
  isActive: Joi.boolean()
    .messages({
      'boolean.base': 'isActive deve ser true ou false'
    })
});

export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Email deve ter um formato válido',
      'any.required': 'Email é obrigatório'
    }),
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Senha é obrigatória'
    })
});
