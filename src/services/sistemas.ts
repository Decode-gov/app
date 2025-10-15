import { BaseService } from './base';
import {
  SistemaResponse,
  SistemaBody,
  UpdateSistemaBody,
} from '@/types/api';

/**
 * Serviço para gerenciar sistemas
 */
export class SistemaService extends BaseService<
  SistemaResponse,
  SistemaBody,
  UpdateSistemaBody
> {
  constructor() {
    super('/sistemas');
  }
}

export const sistemaService = new SistemaService();