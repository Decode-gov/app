import { BaseService } from './base';
import type {
  ComunidadeResponse,
  ComunidadeBody,
  UpdateComunidadeBody,
} from '@/types/api';

/**
 * Serviço para gerenciar comunidades (domínios)
 */
export class ComunidadeService extends BaseService<
  ComunidadeResponse,
  ComunidadeBody,
  UpdateComunidadeBody
> {
  constructor() {
    super('/comunidades');
  }
}

export const comunidadeService = new ComunidadeService();