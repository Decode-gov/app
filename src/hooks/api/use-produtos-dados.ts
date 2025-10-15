/**
 * Hooks para gerenciamento de Produtos de Dados
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { produtosDadosService } from '@/services';
import type { QueryParams, ApiError } from '@/types/api';
import type { CreateProdutoDadosFormData, UpdateProdutoDadosFormData } from '@/schemas';

/**
 * Chaves de query para produtos de dados
 */
export const produtoDadosQueryKeys = {
  all: ['produtos-dados'] as const,
  lists: () => [...produtoDadosQueryKeys.all, 'list'] as const,
  list: (params?: QueryParams) => [...produtoDadosQueryKeys.lists(), { params }] as const,
  details: () => [...produtoDadosQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...produtoDadosQueryKeys.details(), id] as const,
};

/**
 * Hook para listar produtos de dados com paginação
 */
export function useProdutosDados(params?: QueryParams) {
  return useQuery({
    queryKey: produtoDadosQueryKeys.list(params),
    queryFn: () => produtosDadosService.list(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook para buscar um produto de dados por ID
 */
export function useProdutoDadosDetail(id: string, enabled = true) {
  return useQuery({
    queryKey: produtoDadosQueryKeys.detail(id),
    queryFn: () => produtosDadosService.getById(id),
    enabled: !!id && enabled,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook para criar produto de dados
 */
export function useCreateProdutoDados() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProdutoDadosFormData) => produtosDadosService.create(data),
    onSuccess: (newItem) => {
      queryClient.invalidateQueries({ queryKey: produtoDadosQueryKeys.all });
      queryClient.setQueryData(produtoDadosQueryKeys.detail(newItem.id), newItem);
      toast.success('Produto de dados criado com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao criar produto de dados:', error);
      toast.error(error.message || 'Erro ao criar produto de dados');
    },
  });
}

/**
 * Hook para atualizar produto de dados
 */
export function useUpdateProdutoDados() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProdutoDadosFormData }) =>
      produtosDadosService.update(id, data),
    onSuccess: (updatedItem, { id }) => {
      queryClient.invalidateQueries({ queryKey: produtoDadosQueryKeys.all });
      queryClient.setQueryData(produtoDadosQueryKeys.detail(id), updatedItem);
      toast.success('Produto de dados atualizado com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao atualizar produto de dados:', error);
      toast.error(error.message || 'Erro ao atualizar produto de dados');
    },
  });
}

/**
 * Hook para deletar produto de dados
 */
export function useDeleteProdutoDados() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => produtosDadosService.remove(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: produtoDadosQueryKeys.all });
      queryClient.removeQueries({ queryKey: produtoDadosQueryKeys.detail(id) });
      toast.success('Produto de dados excluído com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao excluir produto de dados:', error);
      toast.error(error.message || 'Erro ao excluir produto de dados');
    },
  });
}