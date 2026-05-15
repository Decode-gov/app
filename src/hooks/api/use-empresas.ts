import { useQuery } from '@tanstack/react-query';
import { empresaService } from '@/services/empresas';
import type { QueryParams } from '@/types/api';

export const empresaQueryKeys = {
  all: ['empresas'] as const,
  lists: () => [...empresaQueryKeys.all, 'list'] as const,
  list: (params?: QueryParams) => [...empresaQueryKeys.lists(), { params }] as const,
};

export function useEmpresas(params?: QueryParams, enabled = true) {
  return useQuery({
    queryKey: empresaQueryKeys.list(params),
    queryFn: () => empresaService.list(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled,
  });
}
