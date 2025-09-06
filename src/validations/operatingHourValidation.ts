import Joi from 'joi';

export const updateOperatingHourSchema = Joi.object({
  label: Joi.string()
    .trim()
    .max(200)
    .optional()
    .messages({
      'string.max': 'Label deve ter no máximo 200 caracteres'
    }),
  visible: Joi.boolean()
    .optional()
});

// Esquema para item individual no bulk update (horários fixos)
const operatingHourItemSchema = Joi.object({
  id: Joi.string()
    .required()
    .messages({
      'any.required': 'ID é obrigatório para atualização'
    }),
  label: Joi.string()
    .trim()
    .max(200)
    .optional()
    .messages({
      'string.max': 'Label deve ter no máximo 200 caracteres'
    }),
  visible: Joi.boolean()
    .optional()
});

// Schema que aceita apenas array direto (formato simplificado)
export const bulkUpdateOperatingHoursSchema = Joi.array()
  .items(operatingHourItemSchema)
  .min(1)
  .required()
  .messages({
    'array.min': 'Pelo menos um horário deve ser fornecido',
    'any.required': 'Lista de horários é obrigatória'
  });

export const groupParamSchema = Joi.object({
  group: Joi.string()
    .valid('header', 'footer')
    .required()
    .messages({
      'any.only': 'Grupo deve ser "header" ou "footer"',
      'any.required': 'Grupo é obrigatório'
    })
});
