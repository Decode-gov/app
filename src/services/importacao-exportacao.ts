import { api } from '@/lib/api';
import type {
  ImportacaoExportacaoResponse,
  ImportacaoExportacaoBody
} from '@/types/api';

/**
 * Serviço para gerenciar importação e exportação
 */
class ImportacaoExportacaoService {
  private readonly endpoint = '/importacao-exportacao';

  /**
   * Lista operações de importação/exportação
   */
  async list(): Promise<ImportacaoExportacaoResponse[]> {
    const response = await api.get(this.endpoint);
    return response.data;
  }

  /**
   * Busca operação por ID
   */
  async getById(id: string): Promise<ImportacaoExportacaoResponse> {
    const response = await api.get(`${this.endpoint}/${id}`);
    return response.data;
  }

  /**
   * Importa dados
   */
  async importar(data: ImportacaoExportacaoBody & { arquivo: File }): Promise<ImportacaoExportacaoResponse> {
    const formData = new FormData();
    formData.append('arquivo', data.arquivo);
    formData.append('formato', data.formato);
    formData.append('entidades', JSON.stringify(data.entidades));

    if (data.filtros) {
      formData.append('filtros', JSON.stringify(data.filtros));
    }

    if (data.opcoes) {
      formData.append('opcoes', JSON.stringify(data.opcoes));
    }

    const response = await api.post(`${this.endpoint}/importar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  /**
   * Exporta dados
   */
  async exportar(data: ImportacaoExportacaoBody): Promise<ImportacaoExportacaoResponse> {
    const response = await api.post(`${this.endpoint}/exportar`, data);
    return response.data;
  }
}

export const importacaoExportacaoService = new ImportacaoExportacaoService();