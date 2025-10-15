import { BaseService } from './base';
import type {
  AtividadeResponse,
  AtividadeBody,
  UpdateAtividadeBody
} from '@/types/api';

/**
 * Serviço para gerenciar atividades
 */
class AtividadeService extends BaseService<
  AtividadeResponse,
  AtividadeBody,
  UpdateAtividadeBody
> {
  constructor() {
    super('/atividades');
  }
}

export const atividadeService = new AtividadeService();