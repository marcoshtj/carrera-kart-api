import { Request, Response } from 'express';
import { ClassificationService } from '../services/ClassificationService';
import { 
  ICreateClassificationRequest, 
  IUpdateClassificationRequest, 
  IClassificationQuery,
  IBulkUpdateClassificationsRequest,
  Category 
} from '../types/classification.types';

export class ClassificationController {
  private classificationService: ClassificationService;

  constructor() {
    this.classificationService = new ClassificationService();
  }

  async createClassification(req: Request, res: Response): Promise<void> {
    try {
      const data: ICreateClassificationRequest = req.body;
      const classification = await this.classificationService.createClassification(data);

      res.status(201).json({
        success: true,
        message: 'Classificação criada com sucesso',
        data: classification
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao criar classificação'
      });
    }
  }

  async getAllClassifications(req: Request, res: Response): Promise<void> {
    try {
      const query: IClassificationQuery = req.query;
      const result = await this.classificationService.getAllClassifications(query);

      res.status(200).json({
        success: true,
        message: 'Classificações encontradas',
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao buscar classificações'
      });
    }
  }

  async getClassificationsByCategory(req: Request, res: Response): Promise<void> {
    try {
      const { category } = req.params;
      
      if (!Object.values(Category).includes(category as Category)) {
        res.status(400).json({
          success: false,
          message: 'Categoria inválida'
        });
        return;
      }

      const classifications = await this.classificationService.getClassificationsByCategory(category as Category);

      res.status(200).json({
        success: true,
        message: `Classificações da categoria ${category}`,
        data: classifications
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao buscar classificações'
      });
    }
  }

  async getClassificationById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const classification = await this.classificationService.getClassificationById(id);

      res.status(200).json({
        success: true,
        message: 'Classificação encontrada',
        data: classification
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao buscar classificação'
      });
    }
  }

  async updateClassification(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData: IUpdateClassificationRequest = req.body;

      const classification = await this.classificationService.updateClassification(id, updateData);

      res.status(200).json({
        success: true,
        message: 'Classificação atualizada com sucesso',
        data: classification
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao atualizar classificação'
      });
    }
  }

  async deleteClassification(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.classificationService.deleteClassification(id);

      res.status(200).json({
        success: true,
        message: 'Classificação deletada com sucesso'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao deletar classificação'
      });
    }
  }

  async getLeaderboard(req: Request, res: Response): Promise<void> {
    try {
      const leaderboard = await this.classificationService.getLeaderboard();

      res.status(200).json({
        success: true,
        message: 'Leaderboard geral',
        data: leaderboard
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao buscar leaderboard'
      });
    }
  }

  async bulkUpdateClassifications(req: Request, res: Response): Promise<void> {
    try {
      const { classifications }: IBulkUpdateClassificationsRequest = req.body;
      const result = await this.classificationService.bulkUpdateClassifications(classifications);

      res.status(200).json({
        success: true,
        message: 'Classificações atualizadas em lote com sucesso',
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao atualizar classificações em lote'
      });
    }
  }
}
