import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { politicaInternaService } from '@/services/politicas-internas';
import type { QueryParams, ApiError } from '@/types/api';
import type {
  CreatePoliticaInternaFormData,
  UpdatePoliticaInternaFormData
} from '@/schemas';

/**
 * Chaves de query para políticas internas
 */
export const politicaInternaQueryKeys = {
  all: ['politicas-internas'] as const,
  lists: () => [...politicaInternaQueryKeys.all, 'list'] as const,
  list: (params?: QueryParams) => [...politicaInternaQueryKeys.lists(), { params }] as const,
  details: () => [...politicaInternaQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...politicaInternaQueryKeys.details(), id] as const,
};

/**
 * Hook para listar políticas internas com paginação
 */
export function usePoliticasInternas(params?: QueryParams) {
  return useQuery({
    queryKey: politicaInternaQueryKeys.list(params),
    queryFn: () => politicaInternaService.list(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook para buscar uma política interna por ID
 */
export function usePoliticaInterna(id: string, enabled = true) {
  return useQuery({
    queryKey: politicaInternaQueryKeys.detail(id),
    queryFn: () => politicaInternaService.getById(id),
    enabled: !!id && enabled,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook para criar política interna
 */
export function useCreatePoliticaInterna() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePoliticaInternaFormData) => politicaInternaService.create(data),
    onSuccess: (newItem) => {
      queryClient.invalidateQueries({ queryKey: politicaInternaQueryKeys.all });
      queryClient.setQueryData(politicaInternaQueryKeys.detail(newItem.id), newItem);
      toast.success('Política Interna criada com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao criar política interna:', error);
      toast.error(error.message || 'Erro ao criar política interna');
    },
  });
}

/**
 * Hook para atualizar política interna
 */
export function useUpdatePoliticaInterna() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePoliticaInternaFormData }) =>
      politicaInternaService.update(id, data),
    onSuccess: (updatedItem, { id }) => {
      queryClient.invalidateQueries({ queryKey: politicaInternaQueryKeys.all });
      queryClient.setQueryData(politicaInternaQueryKeys.detail(id), updatedItem);
      toast.success('Política Interna atualizada com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao atualizar política interna:', error);
      toast.error(error.message || 'Erro ao atualizar política interna');
    },
  });
}

/**
 * Hook para deletar política interna
 */
export function useDeletePoliticaInterna() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => politicaInternaService.remove(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: politicaInternaQueryKeys.all });
      queryClient.removeQueries({ queryKey: politicaInternaQueryKeys.detail(id) });
      toast.success('Política Interna excluída com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao excluir política interna:', error);
      toast.error(error.message || 'Erro ao excluir política interna');
    },
  });
}