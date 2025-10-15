/**
 * Hooks para gerenciamento de Regras de Negócio
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { regraNegocioService } from '@/services';
import type { QueryParams, ApiError } from '@/types/api';
import type { CreateRegraNegocioFormData, UpdateRegraNegocioFormData } from '@/schemas';

/**
 * Chaves de query para regras de negócio
 */
export const regraNegocioQueryKeys = {
  all: ['regras-negocio'] as const,
  lists: () => [...regraNegocioQueryKeys.all, 'list'] as const,
  list: (params?: QueryParams) => [...regraNegocioQueryKeys.lists(), { params }] as const,
  details: () => [...regraNegocioQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...regraNegocioQueryKeys.details(), id] as const,
};

/**
 * Hook para listar regras de negócio com paginação
 */
export function useRegrasNegocio(params?: QueryParams) {
  return useQuery({
    queryKey: regraNegocioQueryKeys.list(params),
    queryFn: () => regraNegocioService.list(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook para buscar uma regra de negócio por ID
 */
export function useRegraNegocioDetail(id: string, enabled = true) {
  return useQuery({
    queryKey: regraNegocioQueryKeys.detail(id),
    queryFn: () => regraNegocioService.getById(id),
    enabled: !!id && enabled,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook para criar regra de negócio
 */
export function useCreateRegraNegocio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRegraNegocioFormData) => regraNegocioService.create(data),
    onSuccess: (newItem) => {
      queryClient.invalidateQueries({ queryKey: regraNegocioQueryKeys.all });
      queryClient.setQueryData(regraNegocioQueryKeys.detail(newItem.id), newItem);
      toast.success('Regra de negócio criada com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao criar regra de negócio:', error);
      toast.error(error.message || 'Erro ao criar regra de negócio');
    },
  });
}

/**
 * Hook para atualizar regra de negócio
 */
export function useUpdateRegraNegocio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRegraNegocioFormData }) =>
      regraNegocioService.update(id, data),
    onSuccess: (updatedItem, { id }) => {
      queryClient.invalidateQueries({ queryKey: regraNegocioQueryKeys.all });
      queryClient.setQueryData(regraNegocioQueryKeys.detail(id), updatedItem);
      toast.success('Regra de negócio atualizada com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao atualizar regra de negócio:', error);
      toast.error(error.message || 'Erro ao atualizar regra de negócio');
    },
  });
}

/**
 * Hook para deletar regra de negócio
 */
export function useDeleteRegraNegocio() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => regraNegocioService.remove(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: regraNegocioQueryKeys.all });
      queryClient.removeQueries({ queryKey: regraNegocioQueryKeys.detail(id) });
      toast.success('Regra de negócio excluída com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao excluir regra de negócio:', error);
      toast.error(error.message || 'Erro ao excluir regra de negócio');
    },
  });
}