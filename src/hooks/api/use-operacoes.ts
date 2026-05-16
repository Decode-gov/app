import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  useGetOperacoes,
  useGetOperacoesId,
  postOperacoes,
  putOperacoesId,
  deleteOperacoesId,
  getGetOperacoesQueryKey,
  getGetOperacoesIdQueryKey,
} from '@/api/generated/endpoints/operacoes/operacoes';
import type { GetOperacoesParams, PostOperacoesBody, PutOperacoesIdBody } from '@/api/generated/model';

export const operacaoQueryKeys = {
  all: ['operacoes'] as const,
  lists: () => [...operacaoQueryKeys.all, 'list'] as const,
  list: (params?: GetOperacoesParams) => [...operacaoQueryKeys.lists(), { params }] as const,
  details: () => [...operacaoQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...operacaoQueryKeys.details(), id] as const,
};

export function useOperacoes(params?: Record<string, unknown>) {
  return useGetOperacoes(params as GetOperacoesParams | undefined);
}

export function useOperacao(id: string, enabled = true) {
  return useGetOperacoesId(id, { query: { enabled: !!id && enabled } });
}

export function useCreateOperacao() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PostOperacoesBody) => postOperacoes(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetOperacoesQueryKey() });
      toast.success('Operação criada com sucesso!');
    },
    onError: () => toast.error('Erro ao criar operação'),
  });
}

export function useUpdateOperacao() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PutOperacoesIdBody }) => putOperacoesId(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: getGetOperacoesQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetOperacoesIdQueryKey(id) });
      toast.success('Operação atualizada com sucesso!');
    },
    onError: () => toast.error('Erro ao atualizar operação'),
  });
}

export function useDeleteOperacao() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteOperacoesId(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: getGetOperacoesQueryKey() });
      queryClient.removeQueries({ queryKey: getGetOperacoesIdQueryKey(id) });
      toast.success('Operação excluída com sucesso!');
    },
    onError: () => toast.error('Erro ao excluir operação'),
  });
}
