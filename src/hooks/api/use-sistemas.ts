import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  useGetSistemas,
  useGetSistemasId,
  postSistemas,
  putSistemasId,
  deleteSistemasId,
  getGetSistemasQueryKey,
  getGetSistemasIdQueryKey,
} from '@/api/generated/endpoints/sistemas/sistemas';
import type { GetSistemasParams, PostSistemasBody, PutSistemasIdBody } from '@/api/generated/model';

export const sistemaQueryKeys = {
  all: ['sistemas'] as const,
  lists: () => [...sistemaQueryKeys.all, 'list'] as const,
  list: (params?: GetSistemasParams) => [...sistemaQueryKeys.lists(), { params }] as const,
  details: () => [...sistemaQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...sistemaQueryKeys.details(), id] as const,
};

export function useSistemas(params?: Record<string, unknown>) {
  return useGetSistemas(params as GetSistemasParams | undefined);
}

export function useSistema(id: string, enabled = true) {
  return useGetSistemasId(id, { query: { enabled: !!id && enabled } });
}

export function useCreateSistema() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PostSistemasBody) => postSistemas(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetSistemasQueryKey() });
      toast.success('Sistema criado com sucesso!');
    },
    onError: () => toast.error('Erro ao criar sistema'),
  });
}

export function useUpdateSistema() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PutSistemasIdBody }) => putSistemasId(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: getGetSistemasQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetSistemasIdQueryKey(id) });
      toast.success('Sistema atualizado com sucesso!');
    },
    onError: () => toast.error('Erro ao atualizar sistema'),
  });
}

export function useDeleteSistema() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSistemasId(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: getGetSistemasQueryKey() });
      queryClient.removeQueries({ queryKey: getGetSistemasIdQueryKey(id) });
      toast.success('Sistema excluído com sucesso!');
    },
    onError: () => toast.error('Erro ao excluir sistema'),
  });
}
