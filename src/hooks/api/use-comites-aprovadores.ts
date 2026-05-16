import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  useGetComitesAprovadores,
  useGetComitesAprovadoresId,
  postComitesAprovadores,
  putComitesAprovadoresId,
  deleteComitesAprovadoresId,
  getGetComitesAprovadoresQueryKey,
  getGetComitesAprovadoresIdQueryKey,
} from '@/api/generated/endpoints/comites-aprovadores/comites-aprovadores';
import type {
  GetComitesAprovadoresParams,
  PostComitesAprovadoresBody,
  PutComitesAprovadoresIdBody,
} from '@/api/generated/model';

export const comiteAprovadorQueryKeys = {
  all: ['comites-aprovadores'] as const,
  lists: () => [...comiteAprovadorQueryKeys.all, 'list'] as const,
  list: (params?: GetComitesAprovadoresParams) => [...comiteAprovadorQueryKeys.lists(), { params }] as const,
  details: () => [...comiteAprovadorQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...comiteAprovadorQueryKeys.details(), id] as const,
};

export function useComitesAprovadores(params?: GetComitesAprovadoresParams) {
  return useGetComitesAprovadores(params);
}

export function useComiteAprovador(id: string, enabled = true) {
  return useGetComitesAprovadoresId(id, { query: { enabled: !!id && enabled } });
}

export function useCreateComiteAprovador() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PostComitesAprovadoresBody) => postComitesAprovadores(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetComitesAprovadoresQueryKey() });
      toast.success('Comitê aprovador criado com sucesso!');
    },
    onError: () => toast.error('Erro ao criar comitê aprovador'),
  });
}

export function useUpdateComiteAprovador() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PutComitesAprovadoresIdBody }) =>
      putComitesAprovadoresId(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: getGetComitesAprovadoresQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetComitesAprovadoresIdQueryKey(id) });
      toast.success('Comitê aprovador atualizado com sucesso!');
    },
    onError: () => toast.error('Erro ao atualizar comitê aprovador'),
  });
}

export function useDeleteComiteAprovador() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteComitesAprovadoresId(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: getGetComitesAprovadoresQueryKey() });
      queryClient.removeQueries({ queryKey: getGetComitesAprovadoresIdQueryKey(id) });
      toast.success('Comitê aprovador excluído com sucesso!');
    },
    onError: () => toast.error('Erro ao excluir comitê aprovador'),
  });
}
