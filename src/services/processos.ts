import { BaseService } from './base';
import {
  ProcessoResponse,
  ProcessoBody,
  UpdateProcessoBody,
} from '@/types/api';

/**
 * Serviço para gerenciar processos
 */
export class ProcessoService extends BaseService<
  ProcessoResponse,
  ProcessoBody,
  UpdateProcessoBody
> {
  constructor() {
    super('/processos');
  }
}

export const processoService = new ProcessoService();