import {
  useGetDashboardMetricas,
  useGetDashboardUsuarioUsuarioId,
  useGetDashboardQualidade,
} from '@/api/generated/endpoints/dashboard/dashboard';
import type { GetDashboardMetricasParams, GetDashboardQualidadeParams } from '@/api/generated/model';

export function useDashboardMetricas(params?: GetDashboardMetricasParams) {
  return useGetDashboardMetricas(params);
}

export function useDashboardUsuario(usuarioId?: string) {
  return useGetDashboardUsuarioUsuarioId(usuarioId ?? '', undefined, {
    query: { enabled: !!usuarioId },
  });
}

export function useDashboardQualidade(params?: GetDashboardQualidadeParams) {
  return useGetDashboardQualidade(params);
}
