import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { comunidadeService } from '@/services/comunidades';
import type { QueryParams, ApiError } from '@/types/api';
import type { CreateComunidadeFormData, UpdateComunidadeFormData } from '@/schemas';

/**
 * Chaves de query para comunidades
 */
export const comunidadeQueryKeys = {
  all: ['comunidades'] as const,
  lists: () => [...comunidadeQueryKeys.all, 'list'] as const,
  list: (params?: QueryParams) => [...comunidadeQueryKeys.lists(), { params }] as const,
  details: () => [...comunidadeQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...comunidadeQueryKeys.details(), id] as const,
};

/**
 * Hook para listar comunidades com paginação
 */
export function useComunidades(params?: QueryParams) {
  return useQuery({
    queryKey: comunidadeQueryKeys.list(params),
    queryFn: () => comunidadeService.list(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook para buscar uma comunidade por ID
 */
export function useComunidade(id: string, enabled = true) {
  return useQuery({
    queryKey: comunidadeQueryKeys.detail(id),
    queryFn: () => comunidadeService.getById(id),
    enabled: !!id && enabled,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook para criar comunidade
 */
export function useCreateComunidade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateComunidadeFormData) => comunidadeService.create(data),
    onSuccess: (newItem) => {
      queryClient.invalidateQueries({ queryKey: comunidadeQueryKeys.all });
      queryClient.setQueryData(comunidadeQueryKeys.detail(newItem.id), newItem);
      toast.success('Comunidade criada com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao criar comunidade:', error);
      toast.error(error.message || 'Erro ao criar comunidade');
    },
  });
}

/**
 * Hook para atualizar comunidade
 */
export function useUpdateComunidade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateComunidadeFormData }) =>
      comunidadeService.update(id, data),
    onSuccess: (updatedItem, { id }) => {
      queryClient.invalidateQueries({ queryKey: comunidadeQueryKeys.all });
      queryClient.setQueryData(comunidadeQueryKeys.detail(id), updatedItem);
      toast.success('Comunidade atualizada com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao atualizar comunidade:', error);
      toast.error(error.message || 'Erro ao atualizar comunidade');
    },
  });
}

/**
 * Hook para deletar comunidade
 */
export function useDeleteComunidade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => comunidadeService.remove(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: comunidadeQueryKeys.all });
      queryClient.removeQueries({ queryKey: comunidadeQueryKeys.detail(id) });
      toast.success('Comunidade excluída com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao excluir comunidade:', error);
      toast.error(error.message || 'Erro ao excluir comunidade');
    },
  });
}