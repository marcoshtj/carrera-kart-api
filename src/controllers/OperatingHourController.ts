import { Request, Response } from 'express';
import { OperatingHourService } from '../services/OperatingHourService';
import { updateOperatingHourSchema, bulkUpdateOperatingHoursSchema } from '../validations/operatingHourValidation';

export class OperatingHourController {
  private operatingHourService: OperatingHourService;

  constructor() {
    this.operatingHourService = new OperatingHourService();
  }

  /**
   * Obter todos os horários de funcionamento agrupados (header e footer)
   */
  public getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const operatingHours = await this.operatingHourService.getAllOperatingHoursGrouped();
      
      res.status(200).json({
        success: true,
        data: operatingHours
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  };

  /**
   * Obter horários de funcionamento visíveis agrupados (header e footer)
   */
  public getVisible = async (req: Request, res: Response): Promise<void> => {
    try {
      const operatingHours = await this.operatingHourService.getVisibleOperatingHoursGrouped();
      
      res.status(200).json({
        success: true,
        data: operatingHours
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  };

  /**
   * Obter horários de funcionamento por grupo (header ou footer)
   */
  public getByGroup = async (req: Request, res: Response): Promise<void> => {
    try {
      const { group } = req.params;
      
      if (!['header', 'footer'].includes(group)) {
        res.status(400).json({
          success: false,
          message: 'Grupo deve ser "header" ou "footer"'
        });
        return;
      }

      const operatingHours = await this.operatingHourService.getOperatingHoursByGroup(group as 'header' | 'footer');
      
      res.status(200).json({
        success: true,
        data: operatingHours
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  };

  /**
   * Obter horário de funcionamento por ID
   */
  public getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const operatingHour = await this.operatingHourService.getOperatingHourById(id);
      
      if (!operatingHour) {
        res.status(404).json({
          success: false,
          message: 'Horário de funcionamento não encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: operatingHour
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  };

  /**
   * Atualizar um horário de funcionamento
   */
  public update = async (req: Request, res: Response): Promise<void> => {
    try {
      const { error, value } = updateOperatingHourSchema.validate(req.body);
      
      if (error) {
        res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          error: error.details[0].message
        });
        return;
      }

      const { id } = req.params;
      const operatingHour = await this.operatingHourService.updateOperatingHour(id, value);
      
      if (!operatingHour) {
        res.status(404).json({
          success: false,
          message: 'Horário de funcionamento não encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Horário de funcionamento atualizado com sucesso',
        data: operatingHour
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  };

  /**
   * Atualizar múltiplos horários de funcionamento
   */
  public bulkUpdate = async (req: Request, res: Response): Promise<void> => {
    try {
      const { error, value } = bulkUpdateOperatingHoursSchema.validate(req.body);
      
      if (error) {
        res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          error: error.details[0].message
        });
        return;
      }

      const result = await this.operatingHourService.bulkUpdateOperatingHours(value);

      res.status(200).json({
        success: true,
        message: 'Horários de funcionamento processados',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  };

  /**
   * Alternar visibilidade de um horário de funcionamento
   */
  public toggleVisibility = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const operatingHour = await this.operatingHourService.toggleVisibility(id);
      
      if (!operatingHour) {
        res.status(404).json({
          success: false,
          message: 'Horário de funcionamento não encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Visibilidade alterada com sucesso',
        data: operatingHour
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  };
}
