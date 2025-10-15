import { BaseService } from './base';
import type { AuditoriaResponse, AuditoriaBody } from '@/types/api';

class AuditoriaService extends BaseService<
  AuditoriaResponse,
  AuditoriaBody,
  AuditoriaBody
> {
  constructor() {
    super('/auditoria');
  }
}

export const auditoriaService = new AuditoriaService();