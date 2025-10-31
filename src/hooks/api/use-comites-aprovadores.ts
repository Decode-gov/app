import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { comiteAprovadorService } from '@/services/comites-aprovadores';
import type { QueryParams, ApiError, CreateComiteAprovadorData, UpdateComiteAprovadorData } from '@/types/api';

/**
 * Chaves de query para comitês aprovadores
 */
export const comiteAprovadorQueryKeys = {
  all: ['comites-aprovadores'] as const,
  lists: () => [...comiteAprovadorQueryKeys.all, 'list'] as const,
  list: (params?: QueryParams) => [...comiteAprovadorQueryKeys.lists(), { params }] as const,
  details: () => [...comiteAprovadorQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...comiteAprovadorQueryKeys.details(), id] as const,
};

/**
 * Hook para listar comitês aprovadores com paginação
 */
export function useComitesAprovadores(params?: QueryParams) {
  return useQuery({
    queryKey: comiteAprovadorQueryKeys.list(params),
    queryFn: () => comiteAprovadorService.list(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook para buscar um comitê aprovador por ID
 */
export function useComiteAprovador(id: string, enabled = true) {
  return useQuery({
    queryKey: comiteAprovadorQueryKeys.detail(id),
    queryFn: () => comiteAprovadorService.getById(id),
    enabled: !!id && enabled,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook para criar comitê aprovador
 */
export function useCreateComiteAprovador() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateComiteAprovadorData) => comiteAprovadorService.create(data),
    onSuccess: (newItem) => {
      queryClient.invalidateQueries({ queryKey: comiteAprovadorQueryKeys.all });
      queryClient.setQueryData(comiteAprovadorQueryKeys.detail(newItem.id), newItem);
      toast.success('Comitê aprovador criado com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao criar comitê aprovador:', error);
      toast.error(error.message || 'Erro ao criar comitê aprovador');
    },
  });
}

/**
 * Hook para atualizar comitê aprovador
 */
export function useUpdateComiteAprovador() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateComiteAprovadorData }) =>
      comiteAprovadorService.update(id, data),
    onSuccess: (updatedItem, { id }) => {
      queryClient.invalidateQueries({ queryKey: comiteAprovadorQueryKeys.all });
      queryClient.setQueryData(comiteAprovadorQueryKeys.detail(id), updatedItem);
      toast.success('Comitê aprovador atualizado com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao atualizar comitê aprovador:', error);
      toast.error(error.message || 'Erro ao atualizar comitê aprovador');
    },
  });
}

/**
 * Hook para deletar comitê aprovador
 */
export function useDeleteComiteAprovador() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => comiteAprovadorService.remove(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: comiteAprovadorQueryKeys.all });
      queryClient.removeQueries({ queryKey: comiteAprovadorQueryKeys.detail(id) });
      toast.success('Comitê aprovador excluído com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao excluir comitê aprovador:', error);
      toast.error(error.message || 'Erro ao excluir comitê aprovador');
    },
  });
}
