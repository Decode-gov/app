import { api } from '@/lib/api';
import type {
  DashboardMetricas,
  DashboardUsuario,
  DashboardQualidade
} from '@/types/api';

/**
 * Serviço para gerenciar dashboard e métricas
 */
class DashboardService {
  private readonly endpoint = '/dashboard';

  /**
   * Busca métricas gerais do dashboard
   */
  async getMetricas(periodo?: string, usuario?: string): Promise<DashboardMetricas> {
    const response = await api.get(`${this.endpoint}/metricas`, {
      params: { periodo, usuario }
    });
    return response.data;
  }

  /**
   * Busca dashboard específico do usuário
   */
  async getDashboardUsuario(): Promise<DashboardUsuario> {
    const response = await api.get(`${this.endpoint}/usuario`);
    return response.data;
  }

  /**
   * Busca métricas de qualidade de dados
   */
  async getMetricasQualidade(): Promise<DashboardQualidade> {
    const response = await api.get(`${this.endpoint}/qualidade`);
    return response.data;
  }
}

export const dashboardService = new DashboardService();