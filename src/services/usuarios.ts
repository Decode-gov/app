import { BaseService } from './base';
import { api } from '@/lib/api';
import type {
  UsuarioResponse,
  CreateUsuarioBody,
  UpdateUsuarioBody,
  LoginBody,
  LoginResponse,
  ChangePasswordBody,
  ChangePasswordResponse,
} from '@/types/api';
import type { CreateUsuarioFormData as RegisterBody } from '@/schemas';

// Re-exportar tipos para uso nos hooks
export type { LoginBody, LoginResponse, ChangePasswordBody, RegisterBody };

/**
 * Serviço para gerenciar usuários
 */
export class UsuarioService extends BaseService<
  UsuarioResponse,
  CreateUsuarioBody,
  UpdateUsuarioBody
> {
  constructor() {
    super('/usuarios');
  }

  /**
   * Faz login do usuário
   */
  async login(data: LoginBody): Promise<LoginResponse> {
    try {
      const response = await api.post(`${this.endpoint}/login`, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Registra um novo usuário
   */
  async register(data: RegisterBody): Promise<UsuarioResponse> {
    try {
      const response = await api.post(`${this.endpoint}/register`, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Faz logout do usuário
   */
  async logout(): Promise<void> {
    try {
      await api.post(`${this.endpoint}/logout`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Altera a senha do usuário
   */
  async changePassword(data: ChangePasswordBody): Promise<ChangePasswordResponse> {
    try {
      const response = await api.put(`${this.endpoint}/change-password`, data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }
}

export const usuarioService = new UsuarioService();