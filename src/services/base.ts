import { AxiosResponse } from 'axios';
import { api } from '@/lib/api';
import { PaginatedResponse, QueryParams, ApiError } from '@/types/api';

/**
 * Classe base para serviços da API
 * Fornece métodos CRUD padrão para todos os recursos
 */
export abstract class BaseService<TResponse, TCreateBody, TUpdateBody = Partial<TCreateBody>> {
  protected readonly endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  /**
   * Lista todos os recursos com paginação
   */
  async list(params?: QueryParams): Promise<PaginatedResponse<TResponse>> {
    try {
      const response: AxiosResponse<PaginatedResponse<TResponse>> = await api.get(
        this.endpoint,
        { params }
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Lista todos os recursos sem paginação
   */
  async listAll(): Promise<TResponse[]> {
    try {
      const response: AxiosResponse<TResponse[]> = await api.get(`${this.endpoint}/todas`);
      return response.data;
    } catch (error) {
      // Se a rota /todas não existir, usar a rota padrão com limite alto
      try {
        const fallbackResponse: AxiosResponse<PaginatedResponse<TResponse>> = await api.get(
          this.endpoint,
          { params: { limit: 1000 } }
        );
        return fallbackResponse.data.data;
      } catch {
        throw this.handleError(error);
      }
    }
  }

  /**
   * Busca um recurso por ID
   */
  async getById(id: string): Promise<TResponse> {
    try {
      const response: AxiosResponse<TResponse> = await api.get(`${this.endpoint}/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Cria um novo recurso
   */
  async create(data: TCreateBody): Promise<TResponse> {
    try {
      const response: AxiosResponse<TResponse> = await api.post(this.endpoint, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Atualiza um recurso existente
   */
  async update(id: string, data: TUpdateBody): Promise<TResponse> {
    try {
      const response: AxiosResponse<TResponse> = await api.put(`${this.endpoint}/${id}`, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Remove um recurso
   */
  async remove(id: string): Promise<void> {
    try {
      await api.delete(`${this.endpoint}/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Tratamento de erros padronizado
   */
  protected handleError(error: unknown): ApiError {
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const axiosError = error as { response: { data?: { message?: string }; status?: number } };
      return {
        message: axiosError.response?.data?.message || 'Erro desconhecido',
        status: axiosError.response?.status,
      };
    }

    if (error instanceof Error) {
      return {
        message: error.message,
      };
    }

    return {
      message: 'Erro desconhecido',
    };
  }
}