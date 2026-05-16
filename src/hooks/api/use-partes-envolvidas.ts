import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  useGetPartesEnvolvidas,
  useGetPartesEnvolvidasId,
  postPartesEnvolvidas,
  putPartesEnvolvidasId,
  deletePartesEnvolvidasId,
  getGetPartesEnvolvidasQueryKey,
  getGetPartesEnvolvidasIdQueryKey,
} from '@/api/generated/endpoints/partes-envolvidas/partes-envolvidas';
import type {
  GetPartesEnvolvidasParams,
  PostPartesEnvolvidasBody,
  PutPartesEnvolvidasIdBody,
} from '@/api/generated/model';

export const parteEnvolvidaQueryKeys = {
  all: ['partes-envolvidas'] as const,
  lists: () => [...parteEnvolvidaQueryKeys.all, 'list'] as const,
  list: (params?: GetPartesEnvolvidasParams) => [...parteEnvolvidaQueryKeys.lists(), { params }] as const,
  details: () => [...parteEnvolvidaQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...parteEnvolvidaQueryKeys.details(), id] as const,
};

export function usePartesEnvolvidas(params?: GetPartesEnvolvidasParams) {
  return useGetPartesEnvolvidas(params);
}

export function useParteEnvolvida(id: string, enabled = true) {
  return useGetPartesEnvolvidasId(id, { query: { enabled: !!id && enabled } });
}

export function useCreateParteEnvolvida() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PostPartesEnvolvidasBody) => postPartesEnvolvidas(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetPartesEnvolvidasQueryKey() });
      toast.success('Parte envolvida criada com sucesso!');
    },
    onError: () => toast.error('Erro ao criar parte envolvida'),
  });
}

export function useUpdateParteEnvolvida() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PutPartesEnvolvidasIdBody }) =>
      putPartesEnvolvidasId(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: getGetPartesEnvolvidasQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetPartesEnvolvidasIdQueryKey(id) });
      toast.success('Parte envolvida atualizada com sucesso!');
    },
    onError: () => toast.error('Erro ao atualizar parte envolvida'),
  });
}

export function useDeleteParteEnvolvida() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePartesEnvolvidasId(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: getGetPartesEnvolvidasQueryKey() });
      queryClient.removeQueries({ queryKey: getGetPartesEnvolvidasIdQueryKey(id) });
      toast.success('Parte envolvida excluída com sucesso!');
    },
    onError: () => toast.error('Erro ao excluir parte envolvida'),
  });
}
