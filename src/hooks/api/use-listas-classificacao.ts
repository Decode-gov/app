/**
 * Hooks para gerenciamento de Listas de Classificação
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { listaClassificacaoService } from '@/services';
import type { QueryParams, ApiError } from '@/types/api';
import type { CreateListaClassificacaoFormData, UpdateListaClassificacaoFormData } from '@/schemas';

/**
 * Chaves de query para listas de classificação
 */
export const listaClassificacaoQueryKeys = {
  all: ['listas-classificacao'] as const,
  lists: () => [...listaClassificacaoQueryKeys.all, 'list'] as const,
  list: (params?: QueryParams) => [...listaClassificacaoQueryKeys.lists(), { params }] as const,
  details: () => [...listaClassificacaoQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...listaClassificacaoQueryKeys.details(), id] as const,
};

/**
 * Hook para listar listas de classificação com paginação
 */
export function useListasClassificacao(params?: QueryParams) {
  return useQuery({
    queryKey: listaClassificacaoQueryKeys.list(params),
    queryFn: () => listaClassificacaoService.list(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook para buscar uma lista de classificação por ID
 */
export function useListaClassificacaoDetail(id: string, enabled = true) {
  return useQuery({
    queryKey: listaClassificacaoQueryKeys.detail(id),
    queryFn: () => listaClassificacaoService.getById(id),
    enabled: !!id && enabled,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook para criar lista de classificação
 */
export function useCreateListaClassificacao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateListaClassificacaoFormData) => listaClassificacaoService.create(data),
    onSuccess: (newItem) => {
      queryClient.invalidateQueries({ queryKey: listaClassificacaoQueryKeys.all });
      queryClient.setQueryData(listaClassificacaoQueryKeys.detail(newItem.id), newItem);
      toast.success('Lista de classificação criada com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao criar lista de classificação:', error);
      toast.error(error.message || 'Erro ao criar lista de classificação');
    },
  });
}

/**
 * Hook para atualizar lista de classificação
 */
export function useUpdateListaClassificacao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateListaClassificacaoFormData }) =>
      listaClassificacaoService.update(id, data),
    onSuccess: (updatedItem, { id }) => {
      queryClient.invalidateQueries({ queryKey: listaClassificacaoQueryKeys.all });
      queryClient.setQueryData(listaClassificacaoQueryKeys.detail(id), updatedItem);
      toast.success('Lista de classificação atualizada com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao atualizar lista de classificação:', error);
      toast.error(error.message || 'Erro ao atualizar lista de classificação');
    },
  });
}

/**
 * Hook para deletar lista de classificação
 */
export function useDeleteListaClassificacao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => listaClassificacaoService.remove(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: listaClassificacaoQueryKeys.all });
      queryClient.removeQueries({ queryKey: listaClassificacaoQueryKeys.detail(id) });
      toast.success('Lista de classificação excluída com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao excluir lista de classificação:', error);
      toast.error(error.message || 'Erro ao excluir lista de classificação');
    },
  });
}