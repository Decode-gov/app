/**
 * Hooks para gerenciamento de Necessidades de Informação
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { necessidadeInformacaoService } from '@/services';
import type { QueryParams, ApiError } from '@/types/api';
import type {
  CreateNecessidadeInformacaoFormData,
  UpdateNecessidadeInformacaoFormData
} from '@/schemas';

/**
 * Chaves de query para necessidades de informação
 */
export const necessidadeInformacaoQueryKeys = {
  all: ['necessidades-informacao'] as const,
  lists: () => [...necessidadeInformacaoQueryKeys.all, 'list'] as const,
  list: (params?: QueryParams) => [...necessidadeInformacaoQueryKeys.lists(), { params }] as const,
  details: () => [...necessidadeInformacaoQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...necessidadeInformacaoQueryKeys.details(), id] as const,
};

/**
 * Hook para listar necessidades de informação com paginação
 */
export function useNecessidadesInformacao(params?: QueryParams) {
  return useQuery({
    queryKey: necessidadeInformacaoQueryKeys.list(params),
    queryFn: () => necessidadeInformacaoService.list(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook para listar todas as necessidades de informação sem paginação
 */
export function useNecessidadesInformacaoAll() {
  return useQuery({
    queryKey: [...necessidadeInformacaoQueryKeys.all, 'all'],
    queryFn: () => necessidadeInformacaoService.listAll(),
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
}

/**
 * Hook para buscar uma necessidade de informação por ID
 */
export function useNecessidadeInformacaoDetail(id: string, enabled = true) {
  return useQuery({
    queryKey: necessidadeInformacaoQueryKeys.detail(id),
    queryFn: () => necessidadeInformacaoService.getById(id),
    enabled: !!id && enabled,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook para criar necessidade de informação
 */
export function useCreateNecessidadeInformacao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateNecessidadeInformacaoFormData) => necessidadeInformacaoService.create(data),
    onSuccess: (newItem) => {
      queryClient.invalidateQueries({ queryKey: necessidadeInformacaoQueryKeys.all });
      queryClient.setQueryData(necessidadeInformacaoQueryKeys.detail(newItem.id), newItem);
      toast.success('Necessidade de Informação criada com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao criar necessidade de informação:', error);
      toast.error(error.message || 'Erro ao criar necessidade de informação');
    },
  });
}

/**
 * Hook para atualizar necessidade de informação
 */
export function useUpdateNecessidadeInformacao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateNecessidadeInformacaoFormData }) =>
      necessidadeInformacaoService.update(id, data),
    onSuccess: (updatedItem, { id }) => {
      queryClient.invalidateQueries({ queryKey: necessidadeInformacaoQueryKeys.all });
      queryClient.setQueryData(necessidadeInformacaoQueryKeys.detail(id), updatedItem);
      toast.success('Necessidade de Informação atualizada com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao atualizar necessidade de informação:', error);
      toast.error(error.message || 'Erro ao atualizar necessidade de informação');
    },
  });
}

/**
 * Hook para deletar necessidade de informação
 */
export function useDeleteNecessidadeInformacao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => necessidadeInformacaoService.remove(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: necessidadeInformacaoQueryKeys.all });
      queryClient.removeQueries({ queryKey: necessidadeInformacaoQueryKeys.detail(id) });
      toast.success('Necessidade de Informação excluída com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao excluir necessidade de informação:', error);
      toast.error(error.message || 'Erro ao excluir necessidade de informação');
    },
  });
}