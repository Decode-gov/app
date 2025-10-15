import { BaseService } from './base';
import { api } from "@/lib/api";
import type { Papel, SelectOption } from "@/types";
import type {
  PapelResponse,
  PapelBody,
  UpdatePapelBody,
} from '@/types/api';

/**
 * Serviço para gerenciar papéis de governança
 */
export class PapelService extends BaseService<
  PapelResponse,
  PapelBody,
  UpdatePapelBody
> {
  constructor() {
    super('/papeis');
  }

  /**
   * Retorna opções para uso em selects
   */
  async getSelectOptions(): Promise<SelectOption[]> {
    const response = await api.get("/papeis")
    return response.data.data.map((item: Papel) => ({
      value: item.id,
      label: item.nome
    }))
  }
}

export const papelService = new PapelService();