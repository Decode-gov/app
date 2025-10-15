import { BaseService } from './base';
import { api } from "@/lib/api";
import type { PoliticaInterna, SelectOption } from "@/types";
import type {
  PoliticaInternaResponse,
  PoliticaInternaBody,
  UpdatePoliticaInternaBody,
} from '@/types/api';

/**
 * Serviço para gerenciar políticas internas
 */
export class PoliticaInternaService extends BaseService<
  PoliticaInternaResponse,
  PoliticaInternaBody,
  UpdatePoliticaInternaBody
> {
  constructor() {
    super('/politicas-internas');
  }

  /**
   * Retorna opções para uso em selects
   */
  async getSelectOptions(): Promise<SelectOption[]> {
    const response = await api.get("/politicas-internas")
    return response.data.data.map((item: PoliticaInterna) => ({
      value: item.id.toString(),
      label: item.nome
    }))
  }
}

export const politicaInternaService = new PoliticaInternaService();