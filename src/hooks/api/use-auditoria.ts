import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  useGetAuditoria,
  useGetAuditoriaId,
  postAuditoria,
  getGetAuditoriaQueryKey,
  getGetAuditoriaIdQueryKey,
} from '@/api/generated/endpoints/auditoria/auditoria';
import type { GetAuditoriaParams, PostAuditoriaBody } from '@/api/generated/model';

export const auditoriaQueryKeys = {
  all: ['auditoria'] as const,
  lists: () => [...auditoriaQueryKeys.all, 'list'] as const,
  list: (params?: GetAuditoriaParams) => [...auditoriaQueryKeys.lists(), { params }] as const,
  details: () => [...auditoriaQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...auditoriaQueryKeys.details(), id] as const,
};

export function useAuditoria(params?: Record<string, unknown>) {
  return useGetAuditoria(params as GetAuditoriaParams | undefined);
}

export function useAuditoriaDetail(id: string, enabled = true) {
  return useGetAuditoriaId(id, { query: { enabled: !!id && enabled } });
}

export function useCreateAuditoria() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PostAuditoriaBody) => postAuditoria(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetAuditoriaQueryKey() });
      toast.success('Log de auditoria criado com sucesso!');
    },
    onError: () => toast.error('Erro ao criar log de auditoria'),
  });
}

export function useUpdateAuditoria() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PostAuditoriaBody }) =>
      postAuditoria(data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: getGetAuditoriaQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetAuditoriaIdQueryKey(id) });
      toast.success('Log de auditoria atualizado com sucesso!');
    },
    onError: () => toast.error('Erro ao atualizar log de auditoria'),
  });
}

export function useDeleteAuditoria() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => Promise.resolve(id),
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: getGetAuditoriaQueryKey() });
      queryClient.removeQueries({ queryKey: getGetAuditoriaIdQueryKey(id) });
      toast.success('Log de auditoria excluído com sucesso!');
    },
    onError: () => toast.error('Erro ao excluir log de auditoria'),
  });
}
