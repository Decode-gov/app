import { BaseService } from './base';
import type {
  CriticidadeRegulatoriaResponse,
  CriticidadeRegulatoriaBody,
  UpdateCriticidadeRegulatoriaBody
} from '@/types/api';

/**
 * Serviço para gerenciar criticidade regulatória
 */
class CriticidadeRegulatoriaService extends BaseService<
  CriticidadeRegulatoriaResponse,
  CriticidadeRegulatoriaBody,
  UpdateCriticidadeRegulatoriaBody
> {
  constructor() {
    super('/criticidade-regulatoria');
  }
}

export const criticidadeRegulatoriaService = new CriticidadeRegulatoriaService();