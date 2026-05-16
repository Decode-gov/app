import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  useGetRegulacoesCompletas,
  useGetRegulacoesCompletasId,
  postRegulacoesCompletas,
  putRegulacoesCompletasId,
  deleteRegulacoesCompletasId,
  getGetRegulacoesCompletasQueryKey,
  getGetRegulacoesCompletasIdQueryKey,
} from '@/api/generated/endpoints/regulacao/regulacao';
import type {
  GetRegulacoesCompletasParams,
  PostRegulacoesCompletasBody,
  PutRegulacoesCompletasIdBody,
} from '@/api/generated/model';

export const regulacaoQueryKeys = {
  all: ['regulacao'] as const,
  lists: () => [...regulacaoQueryKeys.all, 'list'] as const,
  list: (params?: GetRegulacoesCompletasParams) => [...regulacaoQueryKeys.lists(), { params }] as const,
  details: () => [...regulacaoQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...regulacaoQueryKeys.details(), id] as const,
};

export function useRegulacoes(params?: GetRegulacoesCompletasParams) {
  return useGetRegulacoesCompletas(params);
}

export function useRegulacao(id: string, enabled = true) {
  return useGetRegulacoesCompletasId(id, { query: { enabled: !!id && enabled } });
}

export function useCreateRegulacao() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PostRegulacoesCompletasBody) => postRegulacoesCompletas(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetRegulacoesCompletasQueryKey() });
      toast.success('Regulação criada com sucesso!');
    },
    onError: () => toast.error('Erro ao criar regulação'),
  });
}

export function useUpdateRegulacao() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PutRegulacoesCompletasIdBody }) =>
      putRegulacoesCompletasId(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: getGetRegulacoesCompletasQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetRegulacoesCompletasIdQueryKey(id) });
      toast.success('Regulação atualizada com sucesso!');
    },
    onError: () => toast.error('Erro ao atualizar regulação'),
  });
}

export function useDeleteRegulacao() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteRegulacoesCompletasId(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: getGetRegulacoesCompletasQueryKey() });
      queryClient.removeQueries({ queryKey: getGetRegulacoesCompletasIdQueryKey(id) });
      toast.success('Regulação excluída com sucesso!');
    },
    onError: () => toast.error('Erro ao excluir regulação'),
  });
}
