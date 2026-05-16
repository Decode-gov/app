import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  useGetDimensoesQualidade,
  useGetDimensoesQualidadeId,
  postDimensoesQualidade,
  putDimensoesQualidadeId,
  deleteDimensoesQualidadeId,
  getGetDimensoesQualidadeQueryKey,
  getGetDimensoesQualidadeIdQueryKey,
} from '@/api/generated/endpoints/dimensoes-qualidade/dimensoes-qualidade';
import type {
  GetDimensoesQualidadeParams,
  PostDimensoesQualidadeBody,
  PutDimensoesQualidadeIdBody,
} from '@/api/generated/model';

export const dimensaoQualidadeQueryKeys = {
  all: ['dimensoes-qualidade'] as const,
  lists: () => [...dimensaoQualidadeQueryKeys.all, 'list'] as const,
  list: (params?: GetDimensoesQualidadeParams) => [...dimensaoQualidadeQueryKeys.lists(), { params }] as const,
  details: () => [...dimensaoQualidadeQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...dimensaoQualidadeQueryKeys.details(), id] as const,
};

export function useDimensoesQualidade(params?: Record<string, unknown>) {
  return useGetDimensoesQualidade(params as GetDimensoesQualidadeParams | undefined);
}

export function useDimensaoQualidade(id: string, enabled = true) {
  return useGetDimensoesQualidadeId(id, { query: { enabled: !!id && enabled } });
}

export function useCreateDimensaoQualidade() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PostDimensoesQualidadeBody) => postDimensoesQualidade(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetDimensoesQualidadeQueryKey() });
      toast.success('Dimensão de qualidade criada com sucesso!');
    },
    onError: () => toast.error('Erro ao criar dimensão de qualidade'),
  });
}

export function useUpdateDimensaoQualidade() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PutDimensoesQualidadeIdBody }) =>
      putDimensoesQualidadeId(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: getGetDimensoesQualidadeQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetDimensoesQualidadeIdQueryKey(id) });
      toast.success('Dimensão de qualidade atualizada com sucesso!');
    },
    onError: () => toast.error('Erro ao atualizar dimensão de qualidade'),
  });
}

export function useDeleteDimensaoQualidade() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteDimensoesQualidadeId(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: getGetDimensoesQualidadeQueryKey() });
      queryClient.removeQueries({ queryKey: getGetDimensoesQualidadeIdQueryKey(id) });
      toast.success('Dimensão de qualidade excluída com sucesso!');
    },
    onError: () => toast.error('Erro ao excluir dimensão de qualidade'),
  });
}
