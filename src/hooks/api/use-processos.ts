import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  useGetProcessos,
  useGetProcessosId,
  postProcessos,
  putProcessosId,
  deleteProcessosId,
  getGetProcessosQueryKey,
  getGetProcessosIdQueryKey,
} from '@/api/generated/endpoints/processos/processos';
import type { GetProcessosParams, PostProcessosBody, PutProcessosIdBody } from '@/api/generated/model';

export const processoQueryKeys = {
  all: ['processos'] as const,
  lists: () => [...processoQueryKeys.all, 'list'] as const,
  list: (params?: GetProcessosParams) => [...processoQueryKeys.lists(), { params }] as const,
  details: () => [...processoQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...processoQueryKeys.details(), id] as const,
};

export function useProcessos(params?: Record<string, unknown>) {
  return useGetProcessos(params as GetProcessosParams | undefined);
}

export function useProcesso(id: string, enabled = true) {
  return useGetProcessosId(id, { query: { enabled: !!id && enabled } });
}

export function useCreateProcesso() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PostProcessosBody) => postProcessos(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetProcessosQueryKey() });
      toast.success('Processo criado com sucesso!');
    },
    onError: () => toast.error('Erro ao criar processo'),
  });
}

export function useUpdateProcesso() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PutProcessosIdBody }) => putProcessosId(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: getGetProcessosQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetProcessosIdQueryKey(id) });
      toast.success('Processo atualizado com sucesso!');
    },
    onError: () => toast.error('Erro ao atualizar processo'),
  });
}

export function useDeleteProcesso() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProcessosId(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: getGetProcessosQueryKey() });
      queryClient.removeQueries({ queryKey: getGetProcessosIdQueryKey(id) });
      toast.success('Processo excluído com sucesso!');
    },
    onError: () => toast.error('Erro ao excluir processo'),
  });
}
