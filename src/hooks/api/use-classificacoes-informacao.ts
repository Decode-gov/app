import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  useGetClassificacoesInformacao,
  useGetClassificacoesInformacaoId,
  postClassificacoesInformacao,
  putClassificacoesInformacaoId,
  deleteClassificacoesInformacaoId,
  getGetClassificacoesInformacaoQueryKey,
  getGetClassificacoesInformacaoIdQueryKey,
} from '@/api/generated/endpoints/classificacoes-informacao/classificacoes-informacao';
import type {
  GetClassificacoesInformacaoParams,
  PostClassificacoesInformacaoBody,
  PutClassificacoesInformacaoIdBody,
} from '@/api/generated/model';

export const classificacaoQueryKeys = {
  all: ['classificacoes'] as const,
  lists: () => [...classificacaoQueryKeys.all, 'list'] as const,
  list: (params?: GetClassificacoesInformacaoParams) => [...classificacaoQueryKeys.lists(), { params }] as const,
  listAll: () => [...classificacaoQueryKeys.all, 'todas'] as const,
  details: () => [...classificacaoQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...classificacaoQueryKeys.details(), id] as const,
};

export function useClassificacoes(params?: GetClassificacoesInformacaoParams) {
  return useGetClassificacoesInformacao(params);
}

export function useClassificacoesTodas() {
  return useGetClassificacoesInformacao(undefined, { query: { staleTime: 10 * 60 * 1000 } });
}

export function useClassificacao(id: string, enabled = true) {
  return useGetClassificacoesInformacaoId(id, { query: { enabled: !!id && enabled } });
}

export function useCreateClassificacao() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PostClassificacoesInformacaoBody) => postClassificacoesInformacao(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetClassificacoesInformacaoQueryKey() });
      toast.success('Classificação de informação criada com sucesso!');
    },
    onError: () => toast.error('Erro ao criar classificação de informação'),
  });
}

export function useUpdateClassificacao() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PutClassificacoesInformacaoIdBody }) =>
      putClassificacoesInformacaoId(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: getGetClassificacoesInformacaoQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetClassificacoesInformacaoIdQueryKey(id) });
      toast.success('Classificação de informação atualizada com sucesso!');
    },
    onError: () => toast.error('Erro ao atualizar classificação de informação'),
  });
}

export function useDeleteClassificacao() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteClassificacoesInformacaoId(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: getGetClassificacoesInformacaoQueryKey() });
      queryClient.removeQueries({ queryKey: getGetClassificacoesInformacaoIdQueryKey(id) });
      toast.success('Classificação de informação excluída com sucesso!');
    },
    onError: () => toast.error('Erro ao excluir classificação de informação'),
  });
}

export function useAtribuirTermoClassificacao() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, termoId }: { id: string; termoId: string }) =>
      putClassificacoesInformacaoId(id, { termoId } as unknown as PutClassificacoesInformacaoIdBody),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: getGetClassificacoesInformacaoQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetClassificacoesInformacaoIdQueryKey(id) });
      toast.success('Termo atribuído à classificação com sucesso!');
    },
    onError: () => toast.error('Erro ao atribuir termo à classificação'),
  });
}
