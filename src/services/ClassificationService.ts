import { Classification, IClassificationDocument } from '../models/Classification';
import {
  ICreateClassificationRequest,
  IUpdateClassificationRequest,
  IClassificationResponse,
  IClassificationQuery,
  IBulkClassificationRequest,
  IBulkUpdateResult,
  Category
} from '../types/classification.types';
import { IPaginationResult } from '../types/common.types';

export class ClassificationService {
  async createClassification(data: ICreateClassificationRequest): Promise<IClassificationResponse> {
    try {
      // Verificar se já existe um corredor com mesmo nome na mesma categoria
      const existingClassification = await Classification.findOne({
        category: data.category,
        driverName: data.driverName
      });

      if (existingClassification) {
        throw new Error('Corredor já existe nesta categoria');
      }

      const classification = new Classification(data);
      await classification.save();

      return this.formatClassificationResponse(classification);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro ao criar classificação');
    }
  }

  async getAllClassifications(query: IClassificationQuery): Promise<IPaginationResult<IClassificationResponse>> {
    try {
      const {
        category,
        driverName,
        minPoints,
        maxPoints,
        page = 1,
        limit = 10
      } = query;

      const skip = (page - 1) * limit;

      // Construir filtros
      const filters: any = {};
      
      if (category) {
        filters.category = category;
      }
      
      if (driverName) {
        filters.driverName = { $regex: driverName, $options: 'i' };
      }
      
      if (minPoints !== undefined || maxPoints !== undefined) {
        filters.points = {};
        if (minPoints !== undefined) {
          filters.points.$gte = minPoints;
        }
        if (maxPoints !== undefined) {
          filters.points.$lte = maxPoints;
        }
      }

      const [classifications, total] = await Promise.all([
        Classification.find(filters)
          .sort({ category: 1, position: 1 })
          .skip(skip)
          .limit(limit)
          .exec(),
        Classification.countDocuments(filters)
      ]);

      const formattedClassifications = classifications.map(classification => 
        this.formatClassificationResponse(classification)
      );

      return {
        data: formattedClassifications,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error('Erro ao buscar classificações');
    }
  }

  async getClassificationsByCategory(category: Category): Promise<IClassificationResponse[]> {
    try {
      const classifications = await Classification.find({ category })
        .sort({ position: 1 })
        .exec();

      return classifications.map(classification => 
        this.formatClassificationResponse(classification)
      );
    } catch (error) {
      throw new Error('Erro ao buscar classificações por categoria');
    }
  }

  async getClassificationById(id: string): Promise<IClassificationResponse> {
    try {
      const classification = await Classification.findById(id);
      
      if (!classification) {
        throw new Error('Classificação não encontrada');
      }

      return this.formatClassificationResponse(classification);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro ao buscar classificação');
    }
  }

  async updateClassification(id: string, updateData: IUpdateClassificationRequest): Promise<IClassificationResponse> {
    try {
      // Se nome do corredor ou categoria está sendo atualizado, verificar duplicação
      if (updateData.driverName || updateData.category) {
        const currentClassification = await Classification.findById(id);
        if (!currentClassification) {
          throw new Error('Classificação não encontrada');
        }

        const newDriverName = updateData.driverName || currentClassification.driverName;
        const newCategory = updateData.category || currentClassification.category;

        const existingClassification = await Classification.findOne({
          category: newCategory,
          driverName: newDriverName,
          _id: { $ne: id }
        });

        if (existingClassification) {
          throw new Error('Corredor já existe nesta categoria');
        }
      }

      const classification = await Classification.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!classification) {
        throw new Error('Classificação não encontrada');
      }

      return this.formatClassificationResponse(classification);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro ao atualizar classificação');
    }
  }

  async deleteClassification(id: string): Promise<void> {
    try {
      const classification = await Classification.findByIdAndDelete(id);

      if (!classification) {
        throw new Error('Classificação não encontrada');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro ao deletar classificação');
    }
  }

  async getLeaderboard(): Promise<Record<Category, IClassificationResponse[]>> {
    try {
      const classifications = await Classification.find({})
        .sort({ category: 1, position: 1 })
        .exec();

      const leaderboard: Record<Category, IClassificationResponse[]> = {
        [Category.PREMIUM]: [],
        [Category.OURO]: [],
        [Category.A]: [],
        [Category.B]: [],
        [Category.C]: [],
        [Category.D]: [],
        [Category.E]: [],
        [Category.F]: []
      };

      classifications.forEach(classification => {
        leaderboard[classification.category].push(
          this.formatClassificationResponse(classification)
        );
      });

      return leaderboard;
    } catch (error) {
      throw new Error('Erro ao buscar leaderboard');
    }
  }

  async bulkUpdateClassifications(data: IBulkClassificationRequest[]): Promise<IBulkUpdateResult> {
    try {
      const result: IBulkUpdateResult = {
        created: [],
        updated: [],
        deleted: [],
        total: {
          created: 0,
          updated: 0,
          deleted: 0
        }
      };

      // IDs que vieram na requisição
      const incomingIds = data
        .filter(item => item._id)
        .map(item => item._id);

      // Buscar todas as classificações existentes
      const existingClassifications = await Classification.find({});
      const existingIds = existingClassifications.map(c => c._id.toString());

      // Identificar IDs para deletar (existem no banco mas não vieram na requisição)
      const idsToDelete = existingIds.filter(id => !incomingIds.includes(id));

      // Deletar classificações que não vieram na requisição
      if (idsToDelete.length > 0) {
        await Classification.deleteMany({ _id: { $in: idsToDelete } });
        result.deleted = idsToDelete;
        result.total.deleted = idsToDelete.length;
      }

      // Processar cada item da requisição
      for (const item of data) {
        try {
          if (item._id && existingIds.includes(item._id)) {
            // Atualizar existente
            // Verificar se não há duplicação com outro corredor na mesma categoria
            const duplicateCheck = await Classification.findOne({
              category: item.category,
              driverName: item.driverName,
              _id: { $ne: item._id }
            });

            if (duplicateCheck) {
              throw new Error(`Corredor ${item.driverName} já existe na categoria ${item.category}`);
            }

            const updated = await Classification.findByIdAndUpdate(
              item._id,
              {
                category: item.category,
                driverName: item.driverName,
                points: item.points
              },
              { new: true, runValidators: true }
            );

            if (updated) {
              result.updated.push(this.formatClassificationResponse(updated));
              result.total.updated++;
            }
          } else {
            // Criar novo
            // Verificar se não há duplicação
            const duplicateCheck = await Classification.findOne({
              category: item.category,
              driverName: item.driverName
            });

            if (duplicateCheck) {
              throw new Error(`Corredor ${item.driverName} já existe na categoria ${item.category}`);
            }

            const created = new Classification({
              category: item.category,
              driverName: item.driverName,
              points: item.points
            });

            await created.save();
            result.created.push(this.formatClassificationResponse(created));
            result.total.created++;
          }
        } catch (itemError) {
          // Se houver erro em um item específico, continue com os outros
          console.error(`Erro ao processar item ${item.driverName}:`, itemError);
          throw itemError; // Re-throw para que o erro seja retornado ao cliente
        }
      }

      return result;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro ao atualizar classificações em lote');
    }
  }

  private formatClassificationResponse(classification: IClassificationDocument): IClassificationResponse {
    return {
      _id: classification._id?.toString() || classification.id,
      category: classification.category,
      driverName: classification.driverName,
      points: classification.points,
      position: classification.position || 1,
      createdAt: classification.createdAt!,
      updatedAt: classification.updatedAt!
    };
  }
}
