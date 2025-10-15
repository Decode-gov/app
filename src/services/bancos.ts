import { BaseService } from './base';
import {
  BancoResponse,
  BancoBody,
  UpdateBancoBody,
} from '@/types/api';

/**
 * Serviço para gerenciar bancos de dados
 */
export class BancoService extends BaseService<
  BancoResponse,
  BancoBody,
  UpdateBancoBody
> {
  constructor() {
    super('/bancos');
  }
}

export const bancoService = new BancoService();