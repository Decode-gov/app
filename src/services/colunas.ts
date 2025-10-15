import { BaseService } from './base';
import {
  ColunaResponse,
  CreateColunaBody,
  UpdateColunaBody,
} from '@/types/api';

/**
 * Serviço para gerenciar colunas
 */
export class ColunaService extends BaseService<
  ColunaResponse,
  CreateColunaBody,
  UpdateColunaBody
> {
  constructor() {
    super('/colunas');
  }
}

export const colunaService = new ColunaService();