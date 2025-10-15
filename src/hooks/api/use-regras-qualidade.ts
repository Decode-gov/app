import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { regraQualidadeService } from '@/services/regras-qualidade';
import { QueryParams, ApiError } from '@/types/api';
import type { CreateRegraQualidadeFormData, UpdateRegraQualidadeFormData } from '@/schemas';

/**
 * Chaves de query para regras de qualidade
 */
export const regraQualidadeQueryKeys = {
  all: ['regras-qualidade'] as const,
  lists: () => [...regraQualidadeQueryKeys.all, 'list'] as const,
  list: (params?: QueryParams) => [...regraQualidadeQueryKeys.lists(), { params }] as const,
  details: () => [...regraQualidadeQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...regraQualidadeQueryKeys.details(), id] as const,
};

/**
 * Hook para listar regras de qualidade com paginação
 */
export function useRegrasQualidade(params?: QueryParams) {
  return useQuery({
    queryKey: regraQualidadeQueryKeys.list(params),
    queryFn: () => regraQualidadeService.list(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook para buscar uma regra de qualidade por ID
 */
export function useRegraQualidade(id: string, enabled = true) {
  return useQuery({
    queryKey: regraQualidadeQueryKeys.detail(id),
    queryFn: () => regraQualidadeService.getById(id),
    enabled: !!id && enabled,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook para criar regra de qualidade
 */
export function useCreateRegraQualidade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRegraQualidadeFormData) => regraQualidadeService.create(data),
    onSuccess: (newItem) => {
      queryClient.invalidateQueries({ queryKey: regraQualidadeQueryKeys.all });
      queryClient.setQueryData(regraQualidadeQueryKeys.detail(newItem.id), newItem);
      toast.success('Regra de qualidade criada com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao criar regra de qualidade:', error);
      toast.error(error.message || 'Erro ao criar regra de qualidade');
    },
  });
}

/**
 * Hook para atualizar regra de qualidade
 */
export function useUpdateRegraQualidade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRegraQualidadeFormData }) =>
      regraQualidadeService.update(id, data),
    onSuccess: (updatedItem, { id }) => {
      queryClient.invalidateQueries({ queryKey: regraQualidadeQueryKeys.all });
      queryClient.setQueryData(regraQualidadeQueryKeys.detail(id), updatedItem);
      toast.success('Regra de qualidade atualizada com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao atualizar regra de qualidade:', error);
      toast.error(error.message || 'Erro ao atualizar regra de qualidade');
    },
  });
}

/**
 * Hook para deletar regra de qualidade
 */
export function useDeleteRegraQualidade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => regraQualidadeService.remove(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: regraQualidadeQueryKeys.all });
      queryClient.removeQueries({ queryKey: regraQualidadeQueryKeys.detail(id) });
      toast.success('Regra de qualidade excluída com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao excluir regra de qualidade:', error);
      toast.error(error.message || 'Erro ao excluir regra de qualidade');
    },
  });
}