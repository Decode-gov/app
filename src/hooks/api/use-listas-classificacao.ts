import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  useGetListasClassificacao,
  useGetListasClassificacaoId,
  postListasClassificacao,
  putListasClassificacaoId,
  deleteListasClassificacaoId,
  getGetListasClassificacaoQueryKey,
  getGetListasClassificacaoIdQueryKey,
} from '@/api/generated/endpoints/listas-classificacao/listas-classificacao';
import type {
  GetListasClassificacaoParams,
  PostListasClassificacaoBody,
  PutListasClassificacaoIdBody,
} from '@/api/generated/model';

export const listaClassificacaoQueryKeys = {
  all: ['listas-classificacao'] as const,
  lists: () => [...listaClassificacaoQueryKeys.all, 'list'] as const,
  list: (params?: GetListasClassificacaoParams) => [...listaClassificacaoQueryKeys.lists(), { params }] as const,
  details: () => [...listaClassificacaoQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...listaClassificacaoQueryKeys.details(), id] as const,
};

export function useListasClassificacao(params?: GetListasClassificacaoParams) {
  return useGetListasClassificacao(params);
}

export function useListaClassificacaoDetail(id: string, enabled = true) {
  return useGetListasClassificacaoId(id, { query: { enabled: !!id && enabled } });
}

export function useCreateListaClassificacao() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PostListasClassificacaoBody) => postListasClassificacao(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetListasClassificacaoQueryKey() });
      toast.success('Lista de classificação criada com sucesso!');
    },
    onError: () => toast.error('Erro ao criar lista de classificação'),
  });
}

export function useUpdateListaClassificacao() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PutListasClassificacaoIdBody }) =>
      putListasClassificacaoId(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: getGetListasClassificacaoQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetListasClassificacaoIdQueryKey(id) });
      toast.success('Lista de classificação atualizada com sucesso!');
    },
    onError: () => toast.error('Erro ao atualizar lista de classificação'),
  });
}

export function useDeleteListaClassificacao() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteListasClassificacaoId(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: getGetListasClassificacaoQueryKey() });
      queryClient.removeQueries({ queryKey: getGetListasClassificacaoIdQueryKey(id) });
      toast.success('Lista de classificação excluída com sucesso!');
    },
    onError: () => toast.error('Erro ao excluir lista de classificação'),
  });
}
