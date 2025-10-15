import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { tipoDadosService } from '@/services/tipos-dados';
import { QueryParams, ApiError } from '@/types/api';
import type { CreateTipoDadosFormData, UpdateTipoDadosFormData } from '@/schemas';

/**
 * Chaves de query para tipos de dados
 */
export const tipoDadosQueryKeys = {
  all: ['tipos-dados'] as const,
  lists: () => [...tipoDadosQueryKeys.all, 'list'] as const,
  list: (params?: QueryParams) => [...tipoDadosQueryKeys.lists(), { params }] as const,
  details: () => [...tipoDadosQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...tipoDadosQueryKeys.details(), id] as const,
};

/**
 * Hook para listar tipos de dados com paginação
 */
export function useTiposDados(params?: QueryParams) {
  return useQuery({
    queryKey: tipoDadosQueryKeys.list(params),
    queryFn: () => tipoDadosService.list(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook para buscar um tipo de dados por ID
 */
export function useTipoDados(id: string, enabled = true) {
  return useQuery({
    queryKey: tipoDadosQueryKeys.detail(id),
    queryFn: () => tipoDadosService.getById(id),
    enabled: !!id && enabled,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook para criar tipo de dados
 */
export function useCreateTipoDados() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTipoDadosFormData) => tipoDadosService.create(data),
    onSuccess: (newItem) => {
      queryClient.invalidateQueries({ queryKey: tipoDadosQueryKeys.all });
      queryClient.setQueryData(tipoDadosQueryKeys.detail(newItem.id), newItem);
      toast.success('Tipo de dados criado com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao criar tipo de dados:', error);
      toast.error(error.message || 'Erro ao criar tipo de dados');
    },
  });
}

/**
 * Hook para atualizar tipo de dados
 */
export function useUpdateTipoDados() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTipoDadosFormData }) =>
      tipoDadosService.update(id, data),
    onSuccess: (updatedItem, { id }) => {
      queryClient.invalidateQueries({ queryKey: tipoDadosQueryKeys.all });
      queryClient.setQueryData(tipoDadosQueryKeys.detail(id), updatedItem);
      toast.success('Tipo de dados atualizado com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao atualizar tipo de dados:', error);
      toast.error(error.message || 'Erro ao atualizar tipo de dados');
    },
  });
}

/**
 * Hook para deletar tipo de dados
 */
export function useDeleteTipoDados() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tipoDadosService.remove(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: tipoDadosQueryKeys.all });
      queryClient.removeQueries({ queryKey: tipoDadosQueryKeys.detail(id) });
      toast.success('Tipo de dados excluído com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao excluir tipo de dados:', error);
      toast.error(error.message || 'Erro ao excluir tipo de dados');
    },
  });
}