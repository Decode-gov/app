import { BaseService } from './base';
import {
  TipoDadosResponse,
  TipoDadosBody,
  UpdateTipoDadosBody,
} from '@/types/api';

/**
 * Serviço para gerenciar tipos de dados
 */
export class TipoDadosService extends BaseService<
  TipoDadosResponse,
  TipoDadosBody,
  UpdateTipoDadosBody
> {
  constructor() {
    super('/tipos-dados');
  }
}

export const tipoDadosService = new TipoDadosService();