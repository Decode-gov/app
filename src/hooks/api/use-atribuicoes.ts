import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  useGetAtribuicoes,
  useGetAtribuicoesId,
  postAtribuicoes,
  putAtribuicoesId,
  deleteAtribuicoesId,
  getGetAtribuicoesQueryKey,
  getGetAtribuicoesIdQueryKey,
} from '@/api/generated/endpoints/atribuicoes/atribuicoes';
import type { GetAtribuicoesParams, PostAtribuicoesBody, PutAtribuicoesIdBody } from '@/api/generated/model';

export const atribuicaoQueryKeys = {
  all: ['atribuicoes'] as const,
  lists: () => [...atribuicaoQueryKeys.all, 'list'] as const,
  list: (params?: GetAtribuicoesParams) => [...atribuicaoQueryKeys.lists(), { params }] as const,
  details: () => [...atribuicaoQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...atribuicaoQueryKeys.details(), id] as const,
};

export function useAtribuicoes(params?: Record<string, unknown>) {
  return useGetAtribuicoes(params as GetAtribuicoesParams | undefined);
}

export function useAtribuicaoDetail(id: string, enabled = true) {
  return useGetAtribuicoesId(id, { query: { enabled: !!id && enabled } });
}

export function useCreateAtribuicao() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PostAtribuicoesBody) => postAtribuicoes(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetAtribuicoesQueryKey() });
      toast.success('Atribuição criada com sucesso!');
    },
    onError: () => toast.error('Erro ao criar atribuição'),
  });
}

export function useUpdateAtribuicao() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PutAtribuicoesIdBody }) => putAtribuicoesId(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: getGetAtribuicoesQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetAtribuicoesIdQueryKey(id) });
      toast.success('Atribuição atualizada com sucesso!');
    },
    onError: () => toast.error('Erro ao atualizar atribuição'),
  });
}

export function useDeleteAtribuicao() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAtribuicoesId(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: getGetAtribuicoesQueryKey() });
      queryClient.removeQueries({ queryKey: getGetAtribuicoesIdQueryKey(id) });
      toast.success('Atribuição excluída com sucesso!');
    },
    onError: () => toast.error('Erro ao excluir atribuição'),
  });
}
