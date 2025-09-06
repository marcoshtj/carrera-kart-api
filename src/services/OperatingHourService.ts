import { OperatingHour, IOperatingHourDocument } from '../models/OperatingHour';
import {
  IOperatingHourResponse,
  IUpdateOperatingHourRequest,
  IBulkUpdateOperatingHourRequest,
  IBulkUpdateOperatingHoursResult
} from '../types/operatingHour.types';

export class OperatingHourService {
  
  /**
   * Obter todos os horários de funcionamento agrupados por header/footer
   */
  async getAllOperatingHoursGrouped(): Promise<Record<string, IOperatingHourResponse[]>> {
    try {
      const operatingHours = await OperatingHour.find().sort({ group: 1, slot: 1 });
      
      const grouped: Record<string, IOperatingHourResponse[]> = {
        header: [],
        footer: []
      };

      operatingHours.forEach(hour => {
        grouped[hour.group].push(this.formatOperatingHourResponse(hour));
      });

      return grouped;
    } catch (error) {
      throw new Error(`Erro ao buscar horários de funcionamento: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  /**
   * Obter horários de funcionamento visíveis agrupados por header/footer
   */
  async getVisibleOperatingHoursGrouped(): Promise<Record<string, IOperatingHourResponse[]>> {
    try {
      const operatingHours = await OperatingHour.find({ visible: true }).sort({ group: 1, slot: 1 });
      
      const grouped: Record<string, IOperatingHourResponse[]> = {
        header: [],
        footer: []
      };

      operatingHours.forEach(hour => {
        grouped[hour.group].push(this.formatOperatingHourResponse(hour));
      });

      return grouped;
    } catch (error) {
      throw new Error(`Erro ao buscar horários visíveis: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  /**
   * Obter horários de funcionamento por grupo (header ou footer)
   */
  async getOperatingHoursByGroup(group: 'header' | 'footer'): Promise<IOperatingHourResponse[]> {
    try {
      const operatingHours = await OperatingHour.find({ group }).sort({ slot: 1 });
      return operatingHours.map(hour => this.formatOperatingHourResponse(hour));
    } catch (error) {
      throw new Error(`Erro ao buscar horários do grupo ${group}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  /**
   * Obter horário de funcionamento por ID
   */
  async getOperatingHourById(id: string): Promise<IOperatingHourResponse | null> {
    try {
      const operatingHour = await OperatingHour.findById(id);
      
      if (!operatingHour) {
        return null;
      }

      return this.formatOperatingHourResponse(operatingHour);
    } catch (error) {
      throw new Error(`Erro ao buscar horário de funcionamento: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  /**
   * Atualizar um horário de funcionamento
   */
  async updateOperatingHour(id: string, updateData: IUpdateOperatingHourRequest): Promise<IOperatingHourResponse | null> {
    try {
      const operatingHour = await OperatingHour.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!operatingHour) {
        return null;
      }

      return this.formatOperatingHourResponse(operatingHour);
    } catch (error) {
      throw new Error(`Erro ao atualizar horário de funcionamento: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  /**
   * Atualização em lote de horários de funcionamento
   */
  async bulkUpdateOperatingHours(data: IBulkUpdateOperatingHourRequest[]): Promise<IBulkUpdateOperatingHoursResult> {
    const result: IBulkUpdateOperatingHoursResult = {
      updated: [],
      errors: [],
      total: {
        updated: 0,
        errors: 0
      }
    };

    for (const item of data) {
      try {
        const updatedHour = await this.updateOperatingHour(item.id, {
          label: item.label,
          visible: item.visible
        });

        if (updatedHour) {
          result.updated.push(updatedHour);
          result.total.updated++;
        } else {
          result.errors.push({
            id: item.id,
            error: 'Horário de funcionamento não encontrado'
          });
          result.total.errors++;
        }
      } catch (itemError) {
        result.errors.push({
          id: item.id,
          error: itemError instanceof Error ? itemError.message : 'Erro desconhecido'
        });
        result.total.errors++;
      }
    }

    return result;
  }

  /**
   * Alternar visibilidade de um horário de funcionamento
   */
  async toggleVisibility(id: string): Promise<IOperatingHourResponse | null> {
    try {
      const operatingHour = await OperatingHour.findById(id);
      
      if (!operatingHour) {
        return null;
      }

      operatingHour.visible = !operatingHour.visible;
      await operatingHour.save();

      return this.formatOperatingHourResponse(operatingHour);
    } catch (error) {
      throw new Error(`Erro ao alternar visibilidade: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  /**
   * Formatar resposta do horário de funcionamento
   */
  private formatOperatingHourResponse(operatingHour: IOperatingHourDocument): IOperatingHourResponse {
    return {
      _id: operatingHour._id.toString(),
      group: operatingHour.group,
      slot: operatingHour.slot,
      label: operatingHour.label,
      visible: operatingHour.visible,
      createdAt: operatingHour.createdAt,
      updatedAt: operatingHour.updatedAt
    };
  }
}
