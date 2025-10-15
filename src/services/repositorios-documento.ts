import { BaseService } from './base';
import { api } from '@/lib/api';
import type {
  RepositorioDocumentoResponse,
  RepositorioDocumentoBody,
  UpdateRepositorioDocumentoBody,
  UploadDocumentoBody,
  UploadDocumentoResponse
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

  /**
   * Faz upload de documento para um repositório
   */
  async upload(repositorioId: string, data: UploadDocumentoBody): Promise<UploadDocumentoResponse> {
    const formData = new FormData();
    formData.append('arquivo', data.arquivo);

    if (data.nome) {
      formData.append('nome', data.nome);
    }

    if (data.descricao) {
      formData.append('descricao', data.descricao);
    }

    if (data.pasta) {
      formData.append('pasta', data.pasta);
    }

    const response = await api.post(`${this.endpoint}/${repositorioId}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
}

export const repositorioDocumentoService = new RepositorioDocumentoService();