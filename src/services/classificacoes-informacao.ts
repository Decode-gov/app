import { BaseService } from './base';
import { api } from '@/lib/api';
import {
  ClassificacaoResponse,
  CreateClassificacaoBody,
  UpdateClassificacaoBody,
  UpdateTermoClassificacaoBody,
} from '@/types/api';

/**
 * Serviço para gerenciar classificações de informação
 */
export class ClassificacaoService extends BaseService<
  ClassificacaoResponse,
  CreateClassificacaoBody,
  UpdateClassificacaoBody
> {
  constructor() {
    super('/classificacoes-informacao');
  }

  /**
   * Atualiza apenas o termo de uma classificação
   */
  async updateTermo(id: string, data: UpdateTermoClassificacaoBody): Promise<ClassificacaoResponse> {
    try {
      const response = await api.put(`${this.endpoint}/${id}/termo`, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Lista todas as classificações (sem paginação)
   */
  async listAll(): Promise<ClassificacaoResponse[]> {
    try {
      const response = await api.get(`${this.endpoint}/todas`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Atribui termo a uma classificação
   */
  async atribuirTermo(id: string, termoId: string): Promise<ClassificacaoResponse> {
    try {
      const response = await api.post(`${this.endpoint}/${id}/atribuir-termo`, { termoId });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
}

export const classificacaoService = new ClassificacaoService();