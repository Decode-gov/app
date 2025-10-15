import { BaseService } from './base';
import {
  ListaClassificacaoResponse,
  ListaClassificacaoBody,
  UpdateListaClassificacaoBody,
} from '@/types/api';

/**
 * Serviço para gerenciar listas de classificação
 */
export class ListaClassificacaoService extends BaseService<
  ListaClassificacaoResponse,
  ListaClassificacaoBody,
  UpdateListaClassificacaoBody
> {
  constructor() {
    super('/listas-classificacao');
  }
}

export const listaClassificacaoService = new ListaClassificacaoService();