import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboard';
import { DashboardMetricas, DashboardUsuario, DashboardQualidade, ApiError } from '@/types/api';

/**
 * Hooks para gerenciar dashboard e métricas
 */

/**
 * Hook para buscar métricas gerais do dashboard
 */
export function useDashboardMetricas(periodo?: string, usuario?: string): UseQueryResult<DashboardMetricas, ApiError> {
  return useQuery({
    queryKey: ['dashboard', 'metricas', { periodo, usuario }],
    queryFn: () => dashboardService.getMetricas(periodo, usuario),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
}

/**
 * Hook para buscar dashboard do usuário
 */
export function useDashboardUsuario(): UseQueryResult<DashboardUsuario, ApiError> {
  return useQuery({
    queryKey: ['dashboard', 'usuario'],
    queryFn: () => dashboardService.getDashboardUsuario(),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
}

/**
 * Hook para buscar métricas de qualidade
 */
export function useDashboardQualidade(): UseQueryResult<DashboardQualidade, ApiError> {
  return useQuery({
    queryKey: ['dashboard', 'qualidade'],
    queryFn: () => dashboardService.getMetricasQualidade(),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
}