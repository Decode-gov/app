import { BaseService } from './base';
import type {
  ParteEnvolvidaResponse,
  ParteEnvolvidaBody,
  UpdateParteEnvolvidaBody
} from '@/types/api';

/**
 * Serviço para gerenciar partes envolvidas
 */
class ParteEnvolvidaService extends BaseService<
  ParteEnvolvidaResponse,
  ParteEnvolvidaBody,
  UpdateParteEnvolvidaBody
> {
  constructor() {
    super('/partes-envolvidas');
  }
}

export const parteEnvolvidaService = new ParteEnvolvidaService();