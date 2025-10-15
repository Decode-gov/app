/**
 * Hooks para gerenciamento de Atribuições
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { atribuicaoService } from '@/services';
import type { QueryParams, ApiError } from '@/types/api';
import type { CreateAtribuicaoFormData, UpdateAtribuicaoFormData } from '@/schemas';

/**
 * Chaves de query para atribuições
 */
export const atribuicaoQueryKeys = {
  all: ['atribuicoes'] as const,
  lists: () => [...atribuicaoQueryKeys.all, 'list'] as const,
  list: (params?: QueryParams) => [...atribuicaoQueryKeys.lists(), { params }] as const,
  details: () => [...atribuicaoQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...atribuicaoQueryKeys.details(), id] as const,
};

/**
 * Hook para listar atribuições com paginação
 */
export function useAtribuicoes(params?: QueryParams) {
  return useQuery({
    queryKey: atribuicaoQueryKeys.list(params),
    queryFn: () => atribuicaoService.list(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook para buscar uma atribuição por ID
 */
export function useAtribuicaoDetail(id: string, enabled = true) {
  return useQuery({
    queryKey: atribuicaoQueryKeys.detail(id),
    queryFn: () => atribuicaoService.getById(id),
    enabled: !!id && enabled,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook para criar atribuição
 */
export function useCreateAtribuicao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAtribuicaoFormData) => atribuicaoService.create(data),
    onSuccess: (newItem) => {
      queryClient.invalidateQueries({ queryKey: atribuicaoQueryKeys.all });
      queryClient.setQueryData(atribuicaoQueryKeys.detail(newItem.id), newItem);
      toast.success('Atribuição criada com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao criar atribuição:', error);
      toast.error(error.message || 'Erro ao criar atribuição');
    },
  });
}

/**
 * Hook para atualizar atribuição
 */
export function useUpdateAtribuicao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAtribuicaoFormData }) =>
      atribuicaoService.update(id, data),
    onSuccess: (updatedItem, { id }) => {
      queryClient.invalidateQueries({ queryKey: atribuicaoQueryKeys.all });
      queryClient.setQueryData(atribuicaoQueryKeys.detail(id), updatedItem);
      toast.success('Atribuição atualizada com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao atualizar atribuição:', error);
      toast.error(error.message || 'Erro ao atualizar atribuição');
    },
  });
}

/**
 * Hook para deletar atribuição
 */
export function useDeleteAtribuicao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => atribuicaoService.remove(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: atribuicaoQueryKeys.all });
      queryClient.removeQueries({ queryKey: atribuicaoQueryKeys.detail(id) });
      toast.success('Atribuição excluída com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao excluir atribuição:', error);
      toast.error(error.message || 'Erro ao excluir atribuição');
    },
  });
}