import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { sistemaService } from '@/services/sistemas';
import { QueryParams, ApiError } from '@/types/api';
import type { CreateSistemaFormData, UpdateSistemaFormData } from '@/schemas';

/**
 * Chaves de query para sistemas
 */
export const sistemaQueryKeys = {
  all: ['sistemas'] as const,
  lists: () => [...sistemaQueryKeys.all, 'list'] as const,
  list: (params?: QueryParams) => [...sistemaQueryKeys.lists(), { params }] as const,
  details: () => [...sistemaQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...sistemaQueryKeys.details(), id] as const,
};

/**
 * Hook para listar sistemas com paginação
 */
export function useSistemas(params?: QueryParams) {
  return useQuery({
    queryKey: sistemaQueryKeys.list(params),
    queryFn: () => sistemaService.list(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook para buscar um sistema por ID
 */
export function useSistema(id: string, enabled = true) {
  return useQuery({
    queryKey: sistemaQueryKeys.detail(id),
    queryFn: () => sistemaService.getById(id),
    enabled: !!id && enabled,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook para criar sistema
 */
export function useCreateSistema() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSistemaFormData) => sistemaService.create(data),
    onSuccess: (newItem) => {
      queryClient.invalidateQueries({ queryKey: sistemaQueryKeys.all });
      queryClient.setQueryData(sistemaQueryKeys.detail(newItem.id), newItem);
      toast.success('Sistema criado com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao criar sistema:', error);
      toast.error(error.message || 'Erro ao criar sistema');
    },
  });
}

/**
 * Hook para atualizar sistema
 */
export function useUpdateSistema() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSistemaFormData }) =>
      sistemaService.update(id, data),
    onSuccess: (updatedItem, { id }) => {
      queryClient.invalidateQueries({ queryKey: sistemaQueryKeys.all });
      queryClient.setQueryData(sistemaQueryKeys.detail(id), updatedItem);
      toast.success('Sistema atualizado com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao atualizar sistema:', error);
      toast.error(error.message || 'Erro ao atualizar sistema');
    },
  });
}

/**
 * Hook para deletar sistema
 */
export function useDeleteSistema() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => sistemaService.remove(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: sistemaQueryKeys.all });
      queryClient.removeQueries({ queryKey: sistemaQueryKeys.detail(id) });
      toast.success('Sistema excluído com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao excluir sistema:', error);
      toast.error(error.message || 'Erro ao excluir sistema');
    },
  });
}