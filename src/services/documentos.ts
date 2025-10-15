import { BaseService } from './base';
import {
  DocumentoResponse,
  DocumentoBody,
  UpdateDocumentoBody,
} from '@/types/api';

/**
 * Serviço para gerenciar documentos (polimórfico)
 */
export class DocumentoService extends BaseService<
  DocumentoResponse,
  DocumentoBody,
  UpdateDocumentoBody
> {
  constructor() {
    super('/documentos');
  }
}

export const documentoService = new DocumentoService();