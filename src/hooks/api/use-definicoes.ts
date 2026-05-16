import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  useGetDefinicoes,
  useGetDefinicoesId,
  postDefinicoes,
  putDefinicoesId,
  deleteDefinicoesId,
  getGetDefinicoesQueryKey,
  getGetDefinicoesIdQueryKey,
} from '@/api/generated/endpoints/definicoes/definicoes';
import type { GetDefinicoesParams, PostDefinicoesBody, PutDefinicoesIdBody } from '@/api/generated/model';

export const definicaoQueryKeys = {
  all: ['definicoes'] as const,
  lists: () => [...definicaoQueryKeys.all, 'list'] as const,
  list: (params?: GetDefinicoesParams) => [...definicaoQueryKeys.lists(), { params }] as const,
  details: () => [...definicaoQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...definicaoQueryKeys.details(), id] as const,
};

export function useDefinicoes(params?: Record<string, unknown>) {
  return useGetDefinicoes(params as GetDefinicoesParams | undefined);
}

export function useDefinicao(id: string, enabled = true) {
  return useGetDefinicoesId(id, { query: { enabled: !!id && enabled } });
}

export function useCreateDefinicao() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PostDefinicoesBody) => postDefinicoes(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetDefinicoesQueryKey() });
      toast.success('Definição criada com sucesso!');
    },
    onError: () => toast.error('Erro ao criar definição'),
  });
}

export function useUpdateDefinicao() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PutDefinicoesIdBody }) => putDefinicoesId(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: getGetDefinicoesQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetDefinicoesIdQueryKey(id) });
      toast.success('Definição atualizada com sucesso!');
    },
    onError: () => toast.error('Erro ao atualizar definição'),
  });
}

export function useDeleteDefinicao() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteDefinicoesId(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: getGetDefinicoesQueryKey() });
      queryClient.removeQueries({ queryKey: getGetDefinicoesIdQueryKey(id) });
      toast.success('Definição excluída com sucesso!');
    },
    onError: () => toast.error('Erro ao excluir definição'),
  });
}
