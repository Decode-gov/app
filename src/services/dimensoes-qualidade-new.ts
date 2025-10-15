import { BaseService } from './base';
import type {
  DimensaoQualidadeResponse,
  DimensaoQualidadeBody,
  UpdateDimensaoQualidadeBody
} from '@/types/api';

/**
 * Serviço para gerenciar dimensões de qualidade
 */
class DimensaoQualidadeServiceNew extends BaseService<
  DimensaoQualidadeResponse,
  DimensaoQualidadeBody,
  UpdateDimensaoQualidadeBody
> {
  constructor() {
    super('/dimensoes-qualidade');
  }
}

export const dimensaoQualidadeService = new DimensaoQualidadeServiceNew();

// Manter compatibilidade com o serviço legado existente
export { dimensoesQualidadeService } from './dimensoes-qualidade';