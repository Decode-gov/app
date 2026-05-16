import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  useGetKpis,
  useGetKpisId,
  postKpis,
  putKpisId,
  deleteKpisId,
  getGetKpisQueryKey,
  getGetKpisIdQueryKey,
} from '@/api/generated/endpoints/kpis/kpis';
import type { GetKpisParams, PostKpisBody, PutKpisIdBody } from '@/api/generated/model';

export const kpiQueryKeys = {
  all: ['kpis'] as const,
  lists: () => [...kpiQueryKeys.all, 'list'] as const,
  list: (params?: GetKpisParams) => [...kpiQueryKeys.lists(), { params }] as const,
  details: () => [...kpiQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...kpiQueryKeys.details(), id] as const,
};

export function useKpis(params?: GetKpisParams) {
  return useGetKpis(params);
}

export function useKpi(id: string, enabled = true) {
  return useGetKpisId(id, { query: { enabled: !!id && enabled } });
}

export function useCreateKpi() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PostKpisBody) => postKpis(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetKpisQueryKey() });
      toast.success('KPI criado com sucesso!');
    },
    onError: () => toast.error('Erro ao criar KPI'),
  });
}

export function useUpdateKpi() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PutKpisIdBody }) => putKpisId(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: getGetKpisQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetKpisIdQueryKey(id) });
      toast.success('KPI atualizado com sucesso!');
    },
    onError: () => toast.error('Erro ao atualizar KPI'),
  });
}

export function useDeleteKpi() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteKpisId(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: getGetKpisQueryKey() });
      queryClient.removeQueries({ queryKey: getGetKpisIdQueryKey(id) });
      toast.success('KPI excluído com sucesso!');
    },
    onError: () => toast.error('Erro ao excluir KPI'),
  });
}
