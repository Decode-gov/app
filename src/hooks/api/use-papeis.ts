import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  useGetPapeis,
  useGetPapeisId,
  postPapeis,
  putPapeisId,
  deletePapeisId,
  getGetPapeisQueryKey,
  getGetPapeisIdQueryKey,
} from '@/api/generated/endpoints/papeis/papeis';
import type { GetPapeisParams, PostPapeisBody, PutPapeisIdBody } from '@/api/generated/model';

export const papelQueryKeys = {
  all: ['papeis'] as const,
  lists: () => [...papelQueryKeys.all, 'list'] as const,
  list: (params?: GetPapeisParams) => [...papelQueryKeys.lists(), { params }] as const,
  details: () => [...papelQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...papelQueryKeys.details(), id] as const,
};

export function usePapeis(params?: Record<string, unknown>) {
  return useGetPapeis(params as GetPapeisParams | undefined);
}

export function usePapel(id: string, enabled = true) {
  return useGetPapeisId(id, { query: { enabled: !!id && enabled } });
}

export function useCreatePapel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PostPapeisBody) => postPapeis(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetPapeisQueryKey() });
      toast.success('Papel criado com sucesso!');
    },
    onError: () => toast.error('Erro ao criar papel'),
  });
}

export function useUpdatePapel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PutPapeisIdBody }) => putPapeisId(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: getGetPapeisQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetPapeisIdQueryKey(id) });
      toast.success('Papel atualizado com sucesso!');
    },
    onError: () => toast.error('Erro ao atualizar papel'),
  });
}

export function useDeletePapel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePapeisId(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: getGetPapeisQueryKey() });
      queryClient.removeQueries({ queryKey: getGetPapeisIdQueryKey(id) });
      toast.success('Papel excluído com sucesso!');
    },
    onError: () => toast.error('Erro ao excluir papel'),
  });
}
