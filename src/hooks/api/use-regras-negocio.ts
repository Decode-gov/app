import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  useGetRegrasNegocio,
  useGetRegrasNegocioId,
  postRegrasNegocio,
  putRegrasNegocioId,
  deleteRegrasNegocioId,
  getGetRegrasNegocioQueryKey,
  getGetRegrasNegocioIdQueryKey,
} from '@/api/generated/endpoints/regras-negocio/regras-negocio';
import type {
  GetRegrasNegocioParams,
  PostRegrasNegocioBody,
  PutRegrasNegocioIdBody,
} from '@/api/generated/model';

export const regraNegocioQueryKeys = {
  all: ['regras-negocio'] as const,
  lists: () => [...regraNegocioQueryKeys.all, 'list'] as const,
  list: (params?: GetRegrasNegocioParams) => [...regraNegocioQueryKeys.lists(), { params }] as const,
  details: () => [...regraNegocioQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...regraNegocioQueryKeys.details(), id] as const,
};

export function useRegrasNegocio(params?: Record<string, unknown>) {
  return useGetRegrasNegocio(params as GetRegrasNegocioParams | undefined);
}

export function useRegraNegocioDetail(id: string, enabled = true) {
  return useGetRegrasNegocioId(id, { query: { enabled: !!id && enabled } });
}

export function useCreateRegraNegocio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PostRegrasNegocioBody) => postRegrasNegocio(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetRegrasNegocioQueryKey() });
      toast.success('Regra de negócio criada com sucesso!');
    },
    onError: () => toast.error('Erro ao criar regra de negócio'),
  });
}

export function useUpdateRegraNegocio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PutRegrasNegocioIdBody }) =>
      putRegrasNegocioId(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: getGetRegrasNegocioQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetRegrasNegocioIdQueryKey(id) });
      toast.success('Regra de negócio atualizada com sucesso!');
    },
    onError: () => toast.error('Erro ao atualizar regra de negócio'),
  });
}

export function useDeleteRegraNegocio() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteRegrasNegocioId(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: getGetRegrasNegocioQueryKey() });
      queryClient.removeQueries({ queryKey: getGetRegrasNegocioIdQueryKey(id) });
      toast.success('Regra de negócio excluída com sucesso!');
    },
    onError: () => toast.error('Erro ao excluir regra de negócio'),
  });
}
