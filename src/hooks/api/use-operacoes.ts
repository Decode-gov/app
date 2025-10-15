import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { operacaoService } from '@/services/operacoes';
import { QueryParams, ApiError } from '@/types/api';
import type { CreateOperacaoFormData, UpdateOperacaoFormData } from '@/schemas';

/**
 * Chaves de query para operações
 */
export const operacaoQueryKeys = {
  all: ['operacoes'] as const,
  lists: () => [...operacaoQueryKeys.all, 'list'] as const,
  list: (params?: QueryParams) => [...operacaoQueryKeys.lists(), { params }] as const,
  details: () => [...operacaoQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...operacaoQueryKeys.details(), id] as const,
};

/**
 * Hook para listar operações com paginação
 */
export function useOperacoes(params?: QueryParams) {
  return useQuery({
    queryKey: operacaoQueryKeys.list(params),
    queryFn: () => operacaoService.list(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook para buscar uma operação por ID
 */
export function useOperacao(id: string, enabled = true) {
  return useQuery({
    queryKey: operacaoQueryKeys.detail(id),
    queryFn: () => operacaoService.getById(id),
    enabled: !!id && enabled,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook para criar operação
 */
export function useCreateOperacao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOperacaoFormData) => operacaoService.create(data),
    onSuccess: (newItem) => {
      queryClient.invalidateQueries({ queryKey: operacaoQueryKeys.all });
      queryClient.setQueryData(operacaoQueryKeys.detail(newItem.id), newItem);
      toast.success('Operação criada com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao criar operação:', error);
      toast.error(error.message || 'Erro ao criar operação');
    },
  });
}

/**
 * Hook para atualizar operação
 */
export function useUpdateOperacao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOperacaoFormData }) =>
      operacaoService.update(id, data),
    onSuccess: (updatedItem, { id }) => {
      queryClient.invalidateQueries({ queryKey: operacaoQueryKeys.all });
      queryClient.setQueryData(operacaoQueryKeys.detail(id), updatedItem);
      toast.success('Operação atualizada com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao atualizar operação:', error);
      toast.error(error.message || 'Erro ao atualizar operação');
    },
  });
}

/**
 * Hook para deletar operação
 */
export function useDeleteOperacao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => operacaoService.remove(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: operacaoQueryKeys.all });
      queryClient.removeQueries({ queryKey: operacaoQueryKeys.detail(id) });
      toast.success('Operação excluída com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao excluir operação:', error);
      toast.error(error.message || 'Erro ao excluir operação');
    },
  });
}