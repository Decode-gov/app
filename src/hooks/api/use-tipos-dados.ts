import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  useGetTiposDados,
  useGetTiposDadosId,
  postTiposDados,
  putTiposDadosId,
  deleteTiposDadosId,
  getGetTiposDadosQueryKey,
  getGetTiposDadosIdQueryKey,
} from '@/api/generated/endpoints/tipos-dados/tipos-dados';
import type { GetTiposDadosParams, PostTiposDadosBody, PutTiposDadosIdBody } from '@/api/generated/model';

export const tipoDadosQueryKeys = {
  all: ['tipos-dados'] as const,
  lists: () => [...tipoDadosQueryKeys.all, 'list'] as const,
  list: (params?: GetTiposDadosParams) => [...tipoDadosQueryKeys.lists(), { params }] as const,
  details: () => [...tipoDadosQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...tipoDadosQueryKeys.details(), id] as const,
};

export function useTiposDados(params?: GetTiposDadosParams) {
  return useGetTiposDados(params);
}

export function useTipoDados(id: string, enabled = true) {
  return useGetTiposDadosId(id, { query: { enabled: !!id && enabled } });
}

export function useCreateTipoDados() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PostTiposDadosBody) => postTiposDados(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetTiposDadosQueryKey() });
      toast.success('Tipo de dados criado com sucesso!');
    },
    onError: () => toast.error('Erro ao criar tipo de dados'),
  });
}

export function useUpdateTipoDados() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PutTiposDadosIdBody }) => putTiposDadosId(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: getGetTiposDadosQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetTiposDadosIdQueryKey(id) });
      toast.success('Tipo de dados atualizado com sucesso!');
    },
    onError: () => toast.error('Erro ao atualizar tipo de dados'),
  });
}

export function useDeleteTipoDados() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTiposDadosId(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: getGetTiposDadosQueryKey() });
      queryClient.removeQueries({ queryKey: getGetTiposDadosIdQueryKey(id) });
      toast.success('Tipo de dados excluído com sucesso!');
    },
    onError: () => toast.error('Erro ao excluir tipo de dados'),
  });
}
