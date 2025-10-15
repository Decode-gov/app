import { BaseService } from './base';
import type {
  RegulacaoResponse,
  RegulacaoBody,
  UpdateRegulacaoBody
} from '@/types/api';

/**
 * Serviço para gerenciar regulações
 */
class RegulacaoService extends BaseService<
  RegulacaoResponse,
  RegulacaoBody,
  UpdateRegulacaoBody
> {
  constructor() {
    super('/regulacao');
  }
}

export const regulacaoService = new RegulacaoService();