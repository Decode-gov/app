import { BaseService } from './base';
import type {
  OperacaoResponse,
  OperacaoBody,
  UpdateOperacaoBody
} from '@/types/api';

/**
 * Serviço para gerenciar operações
 */
class OperacaoService extends BaseService<
  OperacaoResponse,
  OperacaoBody,
  UpdateOperacaoBody
> {
  constructor() {
    super('/operacoes');
  }
}

export const operacaoService = new OperacaoService();