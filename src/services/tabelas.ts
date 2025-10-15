import { BaseService } from './base';
import {
  TabelaResponse,
  TabelaBody,
  UpdateTabelaBody,
} from '@/types/api';

/**
 * Serviço para gerenciar tabelas
 */
export class TabelaService extends BaseService<
  TabelaResponse,
  TabelaBody,
  UpdateTabelaBody
> {
  constructor() {
    super('/tabelas');
  }
}

export const tabelaService = new TabelaService();