import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { colunaService } from '@/services/colunas';
import { QueryParams, ApiError } from '@/types/api';
import type { CreateColunaFormData, UpdateColunaFormData } from '@/schemas';

/**
 * Chaves de query para colunas
 */
export const colunaQueryKeys = {
  all: ['colunas'] as const,
  lists: () => [...colunaQueryKeys.all, 'list'] as const,
  list: (params?: QueryParams) => [...colunaQueryKeys.lists(), { params }] as const,
  details: () => [...colunaQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...colunaQueryKeys.details(), id] as const,
};

/**
 * Hook para listar colunas com paginação
 */
export function useColunas(params?: QueryParams) {
  return useQuery({
    queryKey: colunaQueryKeys.list(params),
    queryFn: () => colunaService.list(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook para buscar uma coluna por ID
 */
export function useColuna(id: string, enabled = true) {
  return useQuery({
    queryKey: colunaQueryKeys.detail(id),
    queryFn: () => colunaService.getById(id),
    enabled: !!id && enabled,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook para criar coluna
 */
export function useCreateColuna() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateColunaFormData) => colunaService.create(data),
    onSuccess: (newItem) => {
      queryClient.invalidateQueries({ queryKey: colunaQueryKeys.all });
      queryClient.setQueryData(colunaQueryKeys.detail(newItem.id), newItem);
      toast.success('Coluna criada com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao criar coluna:', error);
      toast.error(error.message || 'Erro ao criar coluna');
    },
  });
}

/**
 * Hook para atualizar coluna
 */
export function useUpdateColuna() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateColunaFormData }) =>
      colunaService.update(id, data),
    onSuccess: (updatedItem, { id }) => {
      queryClient.invalidateQueries({ queryKey: colunaQueryKeys.all });
      queryClient.setQueryData(colunaQueryKeys.detail(id), updatedItem);
      toast.success('Coluna atualizada com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao atualizar coluna:', error);
      toast.error(error.message || 'Erro ao atualizar coluna');
    },
  });
}

/**
 * Hook para deletar coluna
 */
export function useDeleteColuna() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => colunaService.remove(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: colunaQueryKeys.all });
      queryClient.removeQueries({ queryKey: colunaQueryKeys.detail(id) });
      toast.success('Coluna excluída com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao excluir coluna:', error);
      toast.error(error.message || 'Erro ao excluir coluna');
    },
  });
}