import { BaseService } from './base';
import type {
  AtribuicaoResponse,
  AtribuicaoBody,
  UpdateAtribuicaoBody,
} from '@/types/api';

/**
 * Serviço para gerenciar atribuições (papel-domínio)
 */
export class AtribuicaoService extends BaseService<
  AtribuicaoResponse,
  AtribuicaoBody,
  UpdateAtribuicaoBody
> {
  constructor() {
    super('/atribuicoes');
  }
}

export const atribuicaoService = new AtribuicaoService();