import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  useGetRegrasQualidade,
  useGetRegrasQualidadeId,
  postRegrasQualidade,
  putRegrasQualidadeId,
  deleteRegrasQualidadeId,
  getGetRegrasQualidadeQueryKey,
  getGetRegrasQualidadeIdQueryKey,
} from '@/api/generated/endpoints/regras-qualidade/regras-qualidade';
import type {
  GetRegrasQualidadeParams,
  PostRegrasQualidadeBody,
  PutRegrasQualidadeIdBody,
} from '@/api/generated/model';

export const regraQualidadeQueryKeys = {
  all: ['regras-qualidade'] as const,
  lists: () => [...regraQualidadeQueryKeys.all, 'list'] as const,
  list: (params?: GetRegrasQualidadeParams) => [...regraQualidadeQueryKeys.lists(), { params }] as const,
  details: () => [...regraQualidadeQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...regraQualidadeQueryKeys.details(), id] as const,
};

export function useRegrasQualidade(params?: Record<string, unknown>) {
  return useGetRegrasQualidade(params as GetRegrasQualidadeParams | undefined);
}

export function useRegraQualidade(id: string, enabled = true) {
  return useGetRegrasQualidadeId(id, { query: { enabled: !!id && enabled } });
}

export function useCreateRegraQualidade() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PostRegrasQualidadeBody) => postRegrasQualidade(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetRegrasQualidadeQueryKey() });
      toast.success('Regra de qualidade criada com sucesso!');
    },
    onError: () => toast.error('Erro ao criar regra de qualidade'),
  });
}

export function useUpdateRegraQualidade() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PutRegrasQualidadeIdBody }) =>
      putRegrasQualidadeId(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: getGetRegrasQualidadeQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetRegrasQualidadeIdQueryKey(id) });
      toast.success('Regra de qualidade atualizada com sucesso!');
    },
    onError: () => toast.error('Erro ao atualizar regra de qualidade'),
  });
}

export function useDeleteRegraQualidade() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteRegrasQualidadeId(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: getGetRegrasQualidadeQueryKey() });
      queryClient.removeQueries({ queryKey: getGetRegrasQualidadeIdQueryKey(id) });
      toast.success('Regra de qualidade excluída com sucesso!');
    },
    onError: () => toast.error('Erro ao excluir regra de qualidade'),
  });
}
