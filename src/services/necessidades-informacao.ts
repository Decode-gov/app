import { BaseService } from './base';
import type {
  NecessidadeInformacaoResponse,
  NecessidadeInformacaoBody,
  UpdateNecessidadeInformacaoBody
} from '@/types/api';

class NecessidadeInformacaoService extends BaseService<
  NecessidadeInformacaoResponse,
  NecessidadeInformacaoBody,
  UpdateNecessidadeInformacaoBody
> {
  constructor() {
    super('/necessidades-informacao');
  }
}

export const necessidadeInformacaoService = new NecessidadeInformacaoService();