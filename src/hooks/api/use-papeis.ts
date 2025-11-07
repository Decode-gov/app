import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { papelService } from '@/services/papeis';
import type { QueryParams, ApiError } from '@/types/api';
import type { CreatePapelFormData, UpdatePapelFormData } from '@/schemas';

/**
 * Chaves de query para papéis
 */
export const papelQueryKeys = {
  all: ['papeis'] as const,
  lists: () => [...papelQueryKeys.all, 'list'] as const,
  list: (params?: QueryParams) => [...papelQueryKeys.lists(), { params }] as const,
  details: () => [...papelQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...papelQueryKeys.details(), id] as const,
};

/**
 * Hook para listar papéis com paginação
 */
export function usePapeis(params?: QueryParams) {
  return useQuery({
    queryKey: papelQueryKeys.list(params),
    queryFn: () => papelService.list(params),
  });
}

/**
 * Hook para buscar um papel por ID
 */
export function usePapel(id: string, enabled = true) {
  return useQuery({
    queryKey: papelQueryKeys.detail(id),
    queryFn: () => papelService.getById(id),
    enabled: !!id && enabled,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook para criar papel
 */
export function useCreatePapel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePapelFormData) => papelService.create(data),
    onSuccess: (newItem) => {
      queryClient.invalidateQueries({ queryKey: papelQueryKeys.all });
      queryClient.setQueryData(papelQueryKeys.detail(newItem.id), newItem);
      toast.success('Papel criado com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao criar papel:', error);
      toast.error(error.message || 'Erro ao criar papel');
    },
  });
}

/**
 * Hook para atualizar papel
 */
export function useUpdatePapel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePapelFormData }) =>
      papelService.update(id, data),
    onSuccess: (updatedItem, { id }) => {
      queryClient.invalidateQueries({ queryKey: papelQueryKeys.all });
      queryClient.setQueryData(papelQueryKeys.detail(id), updatedItem);
      toast.success('Papel atualizado com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao atualizar papel:', error);
      toast.error(error.message || 'Erro ao atualizar papel');
    },
  });
}

/**
 * Hook para deletar papel
 */
export function useDeletePapel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => papelService.remove(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: papelQueryKeys.all });
      queryClient.removeQueries({ queryKey: papelQueryKeys.detail(id) });
      toast.success('Papel excluído com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao excluir papel:', error);
      toast.error(error.message || 'Erro ao excluir papel');
    },
  });
}