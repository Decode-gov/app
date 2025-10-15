import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { regulacaoService } from '@/services/regulacao';
import { QueryParams, ApiError } from '@/types/api';
import type { CreateRegulacaoFormData, UpdateRegulacaoFormData } from '@/schemas';

/**
 * Chaves de query para regulações
 */
export const regulacaoQueryKeys = {
  all: ['regulacao'] as const,
  lists: () => [...regulacaoQueryKeys.all, 'list'] as const,
  list: (params?: QueryParams) => [...regulacaoQueryKeys.lists(), { params }] as const,
  details: () => [...regulacaoQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...regulacaoQueryKeys.details(), id] as const,
};

/**
 * Hook para listar regulações com paginação
 */
export function useRegulacoes(params?: QueryParams) {
  return useQuery({
    queryKey: regulacaoQueryKeys.list(params),
    queryFn: () => regulacaoService.list(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook para buscar uma regulação por ID
 */
export function useRegulacao(id: string, enabled = true) {
  return useQuery({
    queryKey: regulacaoQueryKeys.detail(id),
    queryFn: () => regulacaoService.getById(id),
    enabled: !!id && enabled,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook para criar regulação
 */
export function useCreateRegulacao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRegulacaoFormData) => regulacaoService.create(data),
    onSuccess: (newItem) => {
      queryClient.invalidateQueries({ queryKey: regulacaoQueryKeys.all });
      queryClient.setQueryData(regulacaoQueryKeys.detail(newItem.id), newItem);
      toast.success('Regulação criada com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao criar regulação:', error);
      toast.error(error.message || 'Erro ao criar regulação');
    },
  });
}

/**
 * Hook para atualizar regulação
 */
export function useUpdateRegulacao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRegulacaoFormData }) =>
      regulacaoService.update(id, data),
    onSuccess: (updatedItem, { id }) => {
      queryClient.invalidateQueries({ queryKey: regulacaoQueryKeys.all });
      queryClient.setQueryData(regulacaoQueryKeys.detail(id), updatedItem);
      toast.success('Regulação atualizada com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao atualizar regulação:', error);
      toast.error(error.message || 'Erro ao atualizar regulação');
    },
  });
}

/**
 * Hook para deletar regulação
 */
export function useDeleteRegulacao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => regulacaoService.remove(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: regulacaoQueryKeys.all });
      queryClient.removeQueries({ queryKey: regulacaoQueryKeys.detail(id) });
      toast.success('Regulação excluída com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao excluir regulação:', error);
      toast.error(error.message || 'Erro ao excluir regulação');
    },
  });
}