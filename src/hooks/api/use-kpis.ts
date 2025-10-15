import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { kpiService } from '@/services/kpis';
import { QueryParams, ApiError } from '@/types/api';
import type { CreateKPIFormData, UpdateKPIFormData } from '@/schemas';

/**
 * Chaves de query para KPIs
 */
export const kpiQueryKeys = {
  all: ['kpis'] as const,
  lists: () => [...kpiQueryKeys.all, 'list'] as const,
  list: (params?: QueryParams) => [...kpiQueryKeys.lists(), { params }] as const,
  details: () => [...kpiQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...kpiQueryKeys.details(), id] as const,
};

/**
 * Hook para listar KPIs com paginação
 */
export function useKpis(params?: QueryParams) {
  return useQuery({
    queryKey: kpiQueryKeys.list(params),
    queryFn: () => kpiService.list(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook para buscar um KPI por ID
 */
export function useKpi(id: string, enabled = true) {
  return useQuery({
    queryKey: kpiQueryKeys.detail(id),
    queryFn: () => kpiService.getById(id),
    enabled: !!id && enabled,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook para criar KPI
 */
export function useCreateKpi() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateKPIFormData) => kpiService.create(data),
    onSuccess: (newItem) => {
      queryClient.invalidateQueries({ queryKey: kpiQueryKeys.all });
      queryClient.setQueryData(kpiQueryKeys.detail(newItem.id), newItem);
      toast.success('KPI criado com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao criar KPI:', error);
      toast.error(error.message || 'Erro ao criar KPI');
    },
  });
}

/**
 * Hook para atualizar KPI
 */
export function useUpdateKpi() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateKPIFormData }) =>
      kpiService.update(id, data),
    onSuccess: (updatedItem, { id }) => {
      queryClient.invalidateQueries({ queryKey: kpiQueryKeys.all });
      queryClient.setQueryData(kpiQueryKeys.detail(id), updatedItem);
      toast.success('KPI atualizado com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao atualizar KPI:', error);
      toast.error(error.message || 'Erro ao atualizar KPI');
    },
  });
}

/**
 * Hook para deletar KPI
 */
export function useDeleteKpi() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => kpiService.remove(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: kpiQueryKeys.all });
      queryClient.removeQueries({ queryKey: kpiQueryKeys.detail(id) });
      toast.success('KPI excluído com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao excluir KPI:', error);
      toast.error(error.message || 'Erro ao excluir KPI');
    },
  });
}