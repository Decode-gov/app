import { BaseService } from './base';
import type {
  DefinicaoResponse,
  DefinicaoBody,
  UpdateDefinicaoBody,
} from '@/types/api';

/**
 * Serviço para gerenciar definições (termos)
 */
export class DefinicaoService extends BaseService<
  DefinicaoResponse,
  DefinicaoBody,
  UpdateDefinicaoBody
> {
  constructor() {
    super('/definicoes');
  }
}

export const definicaoService = new DefinicaoService();