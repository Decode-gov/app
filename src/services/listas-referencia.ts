import { BaseService } from './base';
import type {
  ListaReferenciaResponse,
  ListaReferenciaBody,
  UpdateListaReferenciaBody
} from '@/types/api';

/**
 * Serviço para gerenciar listas de referência
 */
class ListaReferenciaService extends BaseService<
  ListaReferenciaResponse,
  ListaReferenciaBody,
  UpdateListaReferenciaBody
> {
  constructor() {
    super('/listas-referencia');
  }
}

export const listaReferenciaService = new ListaReferenciaService();