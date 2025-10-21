import { api } from '@/lib/api';
import type {
  DimensaoQualidadeResponse,
  DimensaoQualidadeBody,
  UpdateDimensaoQualidadeBody,
  PaginatedResponse,
  QueryParams
} from '@/types/api';
import { AxiosError } from 'axios';

/**
 * Serviço unificado para gerenciar dimensões de qualidade
 * 
 * NOTA: API backend ainda não implementada conforme documentação.
 * Usando endpoint '/dimensoes-qualidade' - ajustar se backend usar rota diferente.
 */
class DimensaoQualidadeService {
  private readonly endpoint = '/dimensoes-qualidade';

  /**
   * Verifica se erro é 404 Not Found
   */
  private isNotFoundError(error: unknown): boolean {
    return error instanceof AxiosError && error.response?.status === 404;
  }

  /**
   * Lista dimensões de qualidade com paginação
   */
  async list(params?: QueryParams): Promise<PaginatedResponse<DimensaoQualidadeResponse>> {
    try {
      const response = await api.get(this.endpoint, { params });
      return response.data;
    } catch (error) {
      // Se API não implementada (404), retornar mock data temporário
      if (this.isNotFoundError(error)) {
        console.warn('⚠️ API de Dimensões de Qualidade ainda não implementada. Usando mock data.');
        const page = params?.page || 1;
        const limit = params?.limit || 10;
        return {
          data: [],
          total: 0,
          page,
          limit,
          totalPages: 0
        };
      }
      throw error;
    }
  }

  /**
   * Busca dimensão de qualidade por ID
   */
  async getById(id: string): Promise<DimensaoQualidadeResponse> {
    try {
      const response = await api.get(`${this.endpoint}/${id}`);
      return response.data;
    } catch (error) {
      if (this.isNotFoundError(error)) {
        throw new Error('Dimensão de qualidade não encontrada');
      }
      throw error;
    }
  }

  /**
   * Cria nova dimensão de qualidade
   */
  async create(data: DimensaoQualidadeBody): Promise<DimensaoQualidadeResponse> {
    try {
      const response = await api.post(this.endpoint, data);
      return response.data;
    } catch (error) {
      if (this.isNotFoundError(error)) {
        throw new Error('API de criação de dimensões ainda não implementada');
      }
      throw error;
    }
  }

  /**
   * Atualiza dimensão de qualidade existente
   */
  async update(id: string, data: UpdateDimensaoQualidadeBody): Promise<DimensaoQualidadeResponse> {
    try {
      const response = await api.put(`${this.endpoint}/${id}`, data);
      return response.data;
    } catch (error) {
      if (this.isNotFoundError(error)) {
        throw new Error('API de atualização de dimensões ainda não implementada');
      }
      throw error;
    }
  }

  /**
   * Remove dimensão de qualidade
   */
  async remove(id: string): Promise<void> {
    try {
      await api.delete(`${this.endpoint}/${id}`);
    } catch (error) {
      if (this.isNotFoundError(error)) {
        throw new Error('API de remoção de dimensões ainda não implementada');
      }
      throw error;
    }
  }
}

export const dimensaoQualidadeService = new DimensaoQualidadeService();

// Export alias para compatibilidade
export const dimensoesQualidadeService = dimensaoQualidadeService;