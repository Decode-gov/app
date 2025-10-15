import { BaseService } from './base';
import type {
  RegraNegocioResponse,
  RegraNegocioBody,
  UpdateRegraNegocioBody
} from '@/types/api';

class RegraNegocioService extends BaseService<
  RegraNegocioResponse,
  RegraNegocioBody,
  UpdateRegraNegocioBody
> {
  constructor() {
    super('/regras-negocio');
  }
}

export const regraNegocioService = new RegraNegocioService();

// Manter compatibilidade com código existente
export const regrasNegocioService = regraNegocioService;