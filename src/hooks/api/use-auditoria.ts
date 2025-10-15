/**
 * Hooks para gerenciamento de Auditoria
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { auditoriaService } from '@/services';
import type { AuditoriaBody, QueryParams, ApiError } from '@/types/api';

/**
 * Chaves de query para auditoria
 */
export const auditoriaQueryKeys = {
  all: ['auditoria'] as const,
  lists: () => [...auditoriaQueryKeys.all, 'list'] as const,
  list: (params?: QueryParams) => [...auditoriaQueryKeys.lists(), { params }] as const,
  details: () => [...auditoriaQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...auditoriaQueryKeys.details(), id] as const,
};

/**
 * Hook para listar logs de auditoria com paginação
 */
export function useAuditoria(params?: QueryParams) {
  return useQuery({
    queryKey: auditoriaQueryKeys.list(params),
    queryFn: () => auditoriaService.list(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook para buscar um log de auditoria por ID
 */
export function useAuditoriaDetail(id: string, enabled = true) {
  return useQuery({
    queryKey: auditoriaQueryKeys.detail(id),
    queryFn: () => auditoriaService.getById(id),
    enabled: !!id && enabled,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook para criar log de auditoria
 */
export function useCreateAuditoria() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AuditoriaBody) => auditoriaService.create(data),
    onSuccess: (newItem) => {
      queryClient.invalidateQueries({ queryKey: auditoriaQueryKeys.all });
      queryClient.setQueryData(auditoriaQueryKeys.detail(newItem.id), newItem);
      toast.success('Log de auditoria criado com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao criar log de auditoria:', error);
      toast.error(error.message || 'Erro ao criar log de auditoria');
    },
  });
}

/**
 * Hook para atualizar log de auditoria
 */
export function useUpdateAuditoria() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AuditoriaBody }) =>
      auditoriaService.update(id, data),
    onSuccess: (updatedItem, { id }) => {
      queryClient.invalidateQueries({ queryKey: auditoriaQueryKeys.all });
      queryClient.setQueryData(auditoriaQueryKeys.detail(id), updatedItem);
      toast.success('Log de auditoria atualizado com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao atualizar log de auditoria:', error);
      toast.error(error.message || 'Erro ao atualizar log de auditoria');
    },
  });
}

/**
 * Hook para deletar log de auditoria
 */
export function useDeleteAuditoria() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => auditoriaService.remove(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: auditoriaQueryKeys.all });
      queryClient.removeQueries({ queryKey: auditoriaQueryKeys.detail(id) });
      toast.success('Log de auditoria excluído com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao excluir log de auditoria:', error);
      toast.error(error.message || 'Erro ao excluir log de auditoria');
    },
  });
}