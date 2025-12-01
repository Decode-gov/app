import { BaseService } from './base';
import type {
  RepositorioDocumentoResponse,
  RepositorioDocumentoBody,
  UpdateRepositorioDocumentoBody,
} from '@/types/api';

/**
 * Serviço para gerenciar repositórios de documentos
 */
class RepositorioDocumentoService extends BaseService<
  RepositorioDocumentoResponse,
  RepositorioDocumentoBody,
  UpdateRepositorioDocumentoBody
> {
  constructor() {
    super('/repositorios-documento');
  }
}

export const repositorioDocumentoService = new RepositorioDocumentoService();