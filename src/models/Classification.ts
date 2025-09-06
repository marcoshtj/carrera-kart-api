import mongoose, { Schema, Document } from 'mongoose';
import { IClassification, Category } from '../types/classification.types';

export interface IClassificationDocument extends Omit<IClassification, '_id'>, Document {}

const classificationSchema = new Schema<IClassificationDocument>(
  {
    category: {
      type: String,
      enum: Object.values(Category),
      required: [true, 'Categoria é obrigatória']
    },
    driverName: {
      type: String,
      required: [true, 'Nome do corredor é obrigatório'],
      trim: true,
      maxlength: [100, 'Nome do corredor deve ter no máximo 100 caracteres']
    },
    points: {
      type: Number,
      required: [true, 'Pontuação é obrigatória'],
      min: [0, 'Pontuação deve ser maior ou igual a 0']
    },
    position: {
      type: Number,
      min: [1, 'Posição deve ser maior que 0']
    }
  },
  {
    timestamps: true
  }
);

// Índices para melhor performance
classificationSchema.index({ category: 1, points: -1 });
classificationSchema.index({ driverName: 1 });
classificationSchema.index({ points: -1 });

// Índice composto único para evitar corredores duplicados na mesma categoria
classificationSchema.index({ category: 1, driverName: 1 }, { unique: true });

// Middleware para calcular posição automaticamente antes de salvar
classificationSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('points') || this.isModified('category')) {
    try {
      // Contar quantos corredores têm pontuação maior na mesma categoria
      const higherScores = await Classification.countDocuments({
        category: this.category,
        points: { $gt: this.points },
        _id: { $ne: this._id }
      });
      
      this.position = higherScores + 1;
      next();
    } catch (error) {
      next(error as Error);
    }
  } else {
    next();
  }
});

// Middleware para atualizar posições após salvar
classificationSchema.post('save', async function () {
  await updatePositions(this.category);
});

// Middleware para atualizar posições após remover (usando deleteOne)
classificationSchema.post('deleteOne', { document: true, query: false }, async function () {
  await updatePositions(this.category);
});

// Função auxiliar para atualizar todas as posições de uma categoria
async function updatePositions(category: Category) {
  try {
    const classifications = await Classification.find({ category })
      .sort({ points: -1 })
      .exec();

    const updatePromises = classifications.map((classification, index) => {
      return Classification.findByIdAndUpdate(
        classification._id,
        { position: index + 1 },
        { new: true }
      );
    });

    await Promise.all(updatePromises);
  } catch (error) {
    console.error('Erro ao atualizar posições:', error);
  }
}

export const Classification = mongoose.model<IClassificationDocument>('Classification', classificationSchema);
