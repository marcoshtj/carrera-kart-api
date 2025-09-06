import Joi from 'joi';
import { Category } from '../types/classification.types';

export const createClassificationSchema = Joi.object({
  category: Joi.string()
    .valid(...Object.values(Category))
    .required()
    .messages({
      'any.only': 'Categoria deve ser uma das opções válidas: PREMIUM, OURO, A, B, C, D, E, F',
      'any.required': 'Categoria é obrigatória'
    }),
  driverName: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'Nome do corredor deve ter pelo menos 2 caracteres',
      'string.max': 'Nome do corredor deve ter no máximo 100 caracteres',
      'any.required': 'Nome do corredor é obrigatório'
    }),
  points: Joi.number()
    .min(0)
    .required()
    .messages({
      'number.min': 'Pontuação deve ser maior ou igual a 0',
      'any.required': 'Pontuação é obrigatória'
    })
});

export const updateClassificationSchema = Joi.object({
  category: Joi.string()
    .valid(...Object.values(Category))
    .messages({
      'any.only': 'Categoria deve ser uma das opções válidas: PREMIUM, OURO, A, B, C, D, E, F'
    }),
  driverName: Joi.string()
    .min(2)
    .max(100)
    .messages({
      'string.min': 'Nome do corredor deve ter pelo menos 2 caracteres',
      'string.max': 'Nome do corredor deve ter no máximo 100 caracteres'
    }),
  points: Joi.number()
    .min(0)
    .messages({
      'number.min': 'Pontuação deve ser maior ou igual a 0'
    })
});

export const bulkClassificationItemSchema = Joi.object({
  _id: Joi.string()
    .optional()
    .messages({
      'string.base': 'ID deve ser uma string válida'
    }),
  category: Joi.string()
    .valid(...Object.values(Category))
    .required()
    .messages({
      'any.only': 'Categoria deve ser uma das opções válidas: PREMIUM, OURO, A, B, C, D, E, F',
      'any.required': 'Categoria é obrigatória'
    }),
  driverName: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'Nome do corredor deve ter pelo menos 2 caracteres',
      'string.max': 'Nome do corredor deve ter no máximo 100 caracteres',
      'any.required': 'Nome do corredor é obrigatório'
    }),
  points: Joi.number()
    .min(0)
    .required()
    .messages({
      'number.min': 'Pontuação deve ser maior ou igual a 0',
      'any.required': 'Pontuação é obrigatória'
    })
});

export const bulkUpdateClassificationsSchema = Joi.object({
  classifications: Joi.array()
    .items(bulkClassificationItemSchema)
    .min(1)
    .required()
    .messages({
      'array.min': 'Deve haver pelo menos uma classificação',
      'any.required': 'Array de classificações é obrigatório'
    })
});

export const classificationQuerySchema = Joi.object({
  category: Joi.string()
    .valid(...Object.values(Category))
    .messages({
      'any.only': 'Categoria deve ser uma das opções válidas: PREMIUM, OURO, A, B, C, D, E, F'
    }),
  driverName: Joi.string()
    .min(1)
    .messages({
      'string.min': 'Nome do corredor deve ter pelo menos 1 caractere'
    }),
  minPoints: Joi.number()
    .min(0)
    .messages({
      'number.min': 'Pontuação mínima deve ser maior ou igual a 0'
    }),
  maxPoints: Joi.number()
    .min(0)
    .messages({
      'number.min': 'Pontuação máxima deve ser maior ou igual a 0'
    }),
  limit: Joi.number()
    .min(1)
    .max(100)
    .default(10)
    .messages({
      'number.min': 'Limite deve ser pelo menos 1',
      'number.max': 'Limite deve ser no máximo 100'
    }),
  page: Joi.number()
    .min(1)
    .default(1)
    .messages({
      'number.min': 'Página deve ser pelo menos 1'
    })
});
