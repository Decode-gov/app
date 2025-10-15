import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { definicaoService } from '@/services/definicoes';
import type { QueryParams, ApiError } from '@/types/api';
import type { CreateDefinicaoFormData, UpdateDefinicaoFormData } from '@/schemas';

/**
 * Chaves de query para definições
 */
export const definicaoQueryKeys = {
  all: ['definicoes'] as const,
  lists: () => [...definicaoQueryKeys.all, 'list'] as const,
  list: (params?: QueryParams) => [...definicaoQueryKeys.lists(), { params }] as const,
  details: () => [...definicaoQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...definicaoQueryKeys.details(), id] as const,
};

/**
 * Hook para listar definições com paginação
 */
export function useDefinicoes(params?: QueryParams) {
  return useQuery({
    queryKey: definicaoQueryKeys.list(params),
    queryFn: () => definicaoService.list(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook para buscar uma definição por ID
 */
export function useDefinicao(id: string, enabled = true) {
  return useQuery({
    queryKey: definicaoQueryKeys.detail(id),
    queryFn: () => definicaoService.getById(id),
    enabled: !!id && enabled,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook para criar definição
 */
export function useCreateDefinicao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDefinicaoFormData) => definicaoService.create(data),
    onSuccess: (newItem) => {
      queryClient.invalidateQueries({ queryKey: definicaoQueryKeys.all });
      queryClient.setQueryData(definicaoQueryKeys.detail(newItem.id), newItem);
      toast.success('Definição criada com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao criar definição:', error);
      toast.error(error.message || 'Erro ao criar definição');
    },
  });
}

/**
 * Hook para atualizar definição
 */
export function useUpdateDefinicao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDefinicaoFormData }) =>
      definicaoService.update(id, data),
    onSuccess: (updatedItem, { id }) => {
      queryClient.invalidateQueries({ queryKey: definicaoQueryKeys.all });
      queryClient.setQueryData(definicaoQueryKeys.detail(id), updatedItem);
      toast.success('Definição atualizada com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao atualizar definição:', error);
      toast.error(error.message || 'Erro ao atualizar definição');
    },
  });
}

/**
 * Hook para deletar definição
 */
export function useDeleteDefinicao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => definicaoService.remove(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: definicaoQueryKeys.all });
      queryClient.removeQueries({ queryKey: definicaoQueryKeys.detail(id) });
      toast.success('Definição excluída com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao excluir definição:', error);
      toast.error(error.message || 'Erro ao excluir definição');
    },
  });
}