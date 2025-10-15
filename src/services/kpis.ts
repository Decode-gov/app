import { BaseService } from './base';
import { api } from "@/lib/api";
import { KPI, SelectOption } from "@/types";
import { KPIFormData } from "@/schemas";
import {
  KpiResponse,
  KpiBody,
  UpdateKpiBody,
} from '@/types/api';

/**
 * Serviço para gerenciar KPIs
 */
export class KpiService extends BaseService<
  KpiResponse,
  KpiBody,
  UpdateKpiBody
> {
  constructor() {
    super('/kpis');
  }

  /**
   * Retorna opções para uso em selects
   */
  async getSelectOptions(): Promise<SelectOption[]> {
    const response = await api.get("/kpis")
    return response.data.data.map((item: KPI) => ({
      value: item.id,
      label: item.nome
    }))
  }
}

export const kpiService = new KpiService();

// Manter compatibilidade com código existente
export const kpisService = {
  list: (page = 1, limit = 10, search = "", filters?: Record<string, string>) =>
    kpiService.list({ page, limit, search, ...filters }),
  getById: (id: string) => kpiService.getById(id),
  create: (data: KPIFormData) => kpiService.create(data as unknown as KpiBody),
  update: (id: string, data: Partial<KPIFormData>) => kpiService.update(id, data as unknown as KpiBody),
  remove: (id: string) => kpiService.remove(id),
  getSelectOptions: () => kpiService.getSelectOptions(),
}