import mongoose, { Schema, Document } from 'mongoose';
import { IOperatingHour } from '../types/operatingHour.types';

export interface IOperatingHourDocument extends Omit<IOperatingHour, '_id'>, Document {}

const operatingHourSchema = new Schema<IOperatingHourDocument>(
  {
    group: {
      type: String,
      required: [true, 'Grupo é obrigatório'],
      enum: ['header', 'footer'],
      trim: true
    },
    slot: {
      type: Number,
      required: [true, 'Slot é obrigatório'],
      min: [1, 'Slot deve ser maior que 0'],
      validate: {
        validator: function(value: number) {
          // @ts-ignore - context this refers to the document
          const doc = this as IOperatingHourDocument;
          // Validar slots baseado no grupo
          if (doc.group === 'header' && (value < 1 || value > 2)) {
            return false;
          }
          if (doc.group === 'footer' && (value < 1 || value > 9)) {
            return false;
          }
          return true;
        },
        message: 'Slot inválido para o grupo especificado (header: 1-2, footer: 1-9)'
      }
    },
    label: {
      type: String,
      required: [true, 'Label é obrigatório'],
      trim: true,
      maxlength: [200, 'Label deve ter no máximo 200 caracteres']
    },
    visible: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Índice único para evitar duplicação de slots por grupo
operatingHourSchema.index({ group: 1, slot: 1 }, { unique: true });
operatingHourSchema.index({ visible: 1 });

export const OperatingHour = mongoose.model<IOperatingHourDocument>('OperatingHour', operatingHourSchema);
