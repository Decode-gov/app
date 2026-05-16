import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  useGetColunas,
  useGetColunasId,
  postColunas,
  putColunasId,
  deleteColunasId,
  getGetColunasQueryKey,
  getGetColunasIdQueryKey,
} from '@/api/generated/endpoints/colunas/colunas';
import type { GetColunasParams, PostColunasBody, PutColunasIdBody } from '@/api/generated/model';

export const colunaQueryKeys = {
  all: ['colunas'] as const,
  lists: () => [...colunaQueryKeys.all, 'list'] as const,
  list: (params?: GetColunasParams) => [...colunaQueryKeys.lists(), { params }] as const,
  details: () => [...colunaQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...colunaQueryKeys.details(), id] as const,
};

export function useColunas(params?: Record<string, unknown>) {
  return useGetColunas(params as GetColunasParams | undefined);
}

export function useColuna(id: string, enabled = true) {
  return useGetColunasId(id, { query: { enabled: !!id && enabled } });
}

export function useCreateColuna() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PostColunasBody) => postColunas(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetColunasQueryKey() });
      toast.success('Coluna criada com sucesso!');
    },
    onError: () => toast.error('Erro ao criar coluna'),
  });
}

export function useUpdateColuna() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PutColunasIdBody }) => putColunasId(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: getGetColunasQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetColunasIdQueryKey(id) });
      toast.success('Coluna atualizada com sucesso!');
    },
    onError: () => toast.error('Erro ao atualizar coluna'),
  });
}

export function useDeleteColuna() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteColunasId(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: getGetColunasQueryKey() });
      queryClient.removeQueries({ queryKey: getGetColunasIdQueryKey(id) });
      toast.success('Coluna excluída com sucesso!');
    },
    onError: () => toast.error('Erro ao excluir coluna'),
  });
}
