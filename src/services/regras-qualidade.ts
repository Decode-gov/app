import { BaseService } from './base';
import type {
  RegraQualidadeResponse,
  RegraQualidadeBody,
  UpdateRegraQualidadeBody
} from '@/types/api';

/**
 * Serviço para gerenciar regras de qualidade
 */
class RegraQualidadeService extends BaseService<
  RegraQualidadeResponse,
  RegraQualidadeBody,
  UpdateRegraQualidadeBody
> {
  constructor() {
    super('/regras-qualidade');
  }
}

export const regraQualidadeService = new RegraQualidadeService();