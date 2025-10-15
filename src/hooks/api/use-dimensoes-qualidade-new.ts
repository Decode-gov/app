import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { dimensaoQualidadeService } from '@/services/dimensoes-qualidade-new';
import { QueryParams, ApiError } from '@/types/api';
import type { CreateDimensaoQualidadeFormData, UpdateDimensaoQualidadeFormData } from '@/schemas';

/**
 * Chaves de query para dimensões de qualidade
 */
export const dimensaoQualidadeQueryKeys = {
  all: ['dimensoes-qualidade'] as const,
  lists: () => [...dimensaoQualidadeQueryKeys.all, 'list'] as const,
  list: (params?: QueryParams) => [...dimensaoQualidadeQueryKeys.lists(), { params }] as const,
  details: () => [...dimensaoQualidadeQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...dimensaoQualidadeQueryKeys.details(), id] as const,
};

/**
 * Hook para listar dimensões de qualidade com paginação
 */
export function useDimensoesQualidade(params?: QueryParams) {
  return useQuery({
    queryKey: dimensaoQualidadeQueryKeys.list(params),
    queryFn: () => dimensaoQualidadeService.list(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook para buscar uma dimensão de qualidade por ID
 */
export function useDimensaoQualidade(id: string, enabled = true) {
  return useQuery({
    queryKey: dimensaoQualidadeQueryKeys.detail(id),
    queryFn: () => dimensaoQualidadeService.getById(id),
    enabled: !!id && enabled,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook para criar dimensão de qualidade
 */
export function useCreateDimensaoQualidade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDimensaoQualidadeFormData) => dimensaoQualidadeService.create(data),
    onSuccess: (newItem) => {
      queryClient.invalidateQueries({ queryKey: dimensaoQualidadeQueryKeys.all });
      queryClient.setQueryData(dimensaoQualidadeQueryKeys.detail(newItem.id), newItem);
      toast.success('Dimensão de qualidade criada com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao criar dimensão de qualidade:', error);
      toast.error(error.message || 'Erro ao criar dimensão de qualidade');
    },
  });
}

/**
 * Hook para atualizar dimensão de qualidade
 */
export function useUpdateDimensaoQualidade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDimensaoQualidadeFormData }) =>
      dimensaoQualidadeService.update(id, data),
    onSuccess: (updatedItem, { id }) => {
      queryClient.invalidateQueries({ queryKey: dimensaoQualidadeQueryKeys.all });
      queryClient.setQueryData(dimensaoQualidadeQueryKeys.detail(id), updatedItem);
      toast.success('Dimensão de qualidade atualizada com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao atualizar dimensão de qualidade:', error);
      toast.error(error.message || 'Erro ao atualizar dimensão de qualidade');
    },
  });
}

/**
 * Hook para deletar dimensão de qualidade
 */
export function useDeleteDimensaoQualidade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => dimensaoQualidadeService.remove(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: dimensaoQualidadeQueryKeys.all });
      queryClient.removeQueries({ queryKey: dimensaoQualidadeQueryKeys.detail(id) });
      toast.success('Dimensão de qualidade excluída com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao excluir dimensão de qualidade:', error);
      toast.error(error.message || 'Erro ao excluir dimensão de qualidade');
    },
  });
}