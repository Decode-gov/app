import { BaseService } from './base';
import type {
  ComiteAprovadorResponse,
  CreateComiteAprovadorData,
  UpdateComiteAprovadorData,
} from '@/types/api';

/**
 * Serviço para gerenciar comitês aprovadores
 */
export class ComiteAprovadorService extends BaseService<
  ComiteAprovadorResponse,
  CreateComiteAprovadorData,
  UpdateComiteAprovadorData
> {
  constructor() {
    super('/comites-aprovadores');
  }
}

export const comiteAprovadorService = new ComiteAprovadorService();
