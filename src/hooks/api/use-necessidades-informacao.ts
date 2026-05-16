import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  useGetNecessidadesInformacao,
  useGetNecessidadesInformacaoId,
  postNecessidadesInformacao,
  putNecessidadesInformacaoId,
  deleteNecessidadesInformacaoId,
  getGetNecessidadesInformacaoQueryKey,
  getGetNecessidadesInformacaoIdQueryKey,
} from '@/api/generated/endpoints/necessidades-informacao/necessidades-informacao';
import type {
  GetNecessidadesInformacaoParams,
  PostNecessidadesInformacaoBody,
  PutNecessidadesInformacaoIdBody,
} from '@/api/generated/model';

export const necessidadeInformacaoQueryKeys = {
  all: ['necessidades-informacao'] as const,
  lists: () => [...necessidadeInformacaoQueryKeys.all, 'list'] as const,
  list: (params?: GetNecessidadesInformacaoParams) => [...necessidadeInformacaoQueryKeys.lists(), { params }] as const,
  details: () => [...necessidadeInformacaoQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...necessidadeInformacaoQueryKeys.details(), id] as const,
};

export function useNecessidadesInformacao(params?: Record<string, unknown>) {
  return useGetNecessidadesInformacao(params as GetNecessidadesInformacaoParams | undefined);
}

export function useNecessidadesInformacaoAll() {
  return useGetNecessidadesInformacao(undefined, { query: { staleTime: 10 * 60 * 1000 } });
}

export function useNecessidadeInformacaoDetail(id: string, enabled = true) {
  return useGetNecessidadesInformacaoId(id, { query: { enabled: !!id && enabled } });
}

export function useCreateNecessidadeInformacao() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PostNecessidadesInformacaoBody) => postNecessidadesInformacao(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetNecessidadesInformacaoQueryKey() });
      toast.success('Necessidade de Informação criada com sucesso!');
    },
    onError: () => toast.error('Erro ao criar necessidade de informação'),
  });
}

export function useUpdateNecessidadeInformacao() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PutNecessidadesInformacaoIdBody }) =>
      putNecessidadesInformacaoId(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: getGetNecessidadesInformacaoQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetNecessidadesInformacaoIdQueryKey(id) });
      toast.success('Necessidade de Informação atualizada com sucesso!');
    },
    onError: () => toast.error('Erro ao atualizar necessidade de informação'),
  });
}

export function useDeleteNecessidadeInformacao() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteNecessidadesInformacaoId(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: getGetNecessidadesInformacaoQueryKey() });
      queryClient.removeQueries({ queryKey: getGetNecessidadesInformacaoIdQueryKey(id) });
      toast.success('Necessidade de Informação excluída com sucesso!');
    },
    onError: () => toast.error('Erro ao excluir necessidade de informação'),
  });
}
