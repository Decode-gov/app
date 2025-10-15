import { BaseService } from './base';
import { api } from '@/lib/api';
import type {
  MfaResponse,
  MfaBody,
  MfaSetupResponse,
  MfaVerifyBody
} from '@/types/api';

/**
 * Serviço para gerenciar MFA (Autenticação Multifator)
 */
class MfaService extends BaseService<MfaResponse, MfaBody, MfaBody> {
  constructor() {
    super('/mfa');
  }

  /**
   * Configura MFA para o usuário
   */
  async setup(): Promise<MfaSetupResponse> {
    const response = await api.post(`${this.endpoint}/setup`);
    return response.data;
  }

  /**
   * Ativa MFA
   */
  async enable(data: MfaVerifyBody): Promise<MfaResponse> {
    const response = await api.post(`${this.endpoint}/enable`, data);
    return response.data;
  }

  /**
   * Verifica código MFA
   */
  async verify(data: MfaVerifyBody): Promise<{ valid: boolean }> {
    const response = await api.post(`${this.endpoint}/verify`, data);
    return response.data;
  }

  /**
   * Desativa MFA
   */
  async disable(): Promise<void> {
    await api.post(`${this.endpoint}/disable`);
  }
}

export const mfaService = new MfaService();