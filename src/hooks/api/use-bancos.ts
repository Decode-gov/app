import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  useGetBancos,
  useGetBancosId,
  postBancos,
  putBancosId,
  deleteBancosId,
  getGetBancosQueryKey,
  getGetBancosIdQueryKey,
} from '@/api/generated/endpoints/bancos/bancos';
import type { GetBancosParams, PostBancosBody, PutBancosIdBody } from '@/api/generated/model';

export const bancoQueryKeys = {
  all: ['bancos'] as const,
  lists: () => [...bancoQueryKeys.all, 'list'] as const,
  list: (params?: GetBancosParams) => [...bancoQueryKeys.lists(), { params }] as const,
  details: () => [...bancoQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...bancoQueryKeys.details(), id] as const,
};

export function useBancos(params?: GetBancosParams) {
  return useGetBancos(params);
}

export function useBanco(id: string, enabled = true) {
  return useGetBancosId(id, { query: { enabled: !!id && enabled } });
}

export function useCreateBanco() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PostBancosBody) => postBancos(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetBancosQueryKey() });
      toast.success('Banco de dados criado com sucesso!');
    },
    onError: () => toast.error('Erro ao criar banco de dados'),
  });
}

export function useUpdateBanco() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PutBancosIdBody }) => putBancosId(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: getGetBancosQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetBancosIdQueryKey(id) });
      toast.success('Banco de dados atualizado com sucesso!');
    },
    onError: () => toast.error('Erro ao atualizar banco de dados'),
  });
}

export function useDeleteBanco() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteBancosId(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: getGetBancosQueryKey() });
      queryClient.removeQueries({ queryKey: getGetBancosIdQueryKey(id) });
      toast.success('Banco de dados excluído com sucesso!');
    },
    onError: () => toast.error('Erro ao excluir banco de dados'),
  });
}
