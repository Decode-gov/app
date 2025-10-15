import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { processoService } from '@/services/processos';
import { QueryParams, ApiError } from '@/types/api';
import type { CreateProcessoFormData, UpdateProcessoFormData } from '@/schemas';

/**
 * Chaves de query para processos
 */
export const processoQueryKeys = {
  all: ['processos'] as const,
  lists: () => [...processoQueryKeys.all, 'list'] as const,
  list: (params?: QueryParams) => [...processoQueryKeys.lists(), { params }] as const,
  details: () => [...processoQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...processoQueryKeys.details(), id] as const,
};

/**
 * Hook para listar processos com paginação
 */
export function useProcessos(params?: QueryParams) {
  return useQuery({
    queryKey: processoQueryKeys.list(params),
    queryFn: () => processoService.list(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook para buscar um processo por ID
 */
export function useProcesso(id: string, enabled = true) {
  return useQuery({
    queryKey: processoQueryKeys.detail(id),
    queryFn: () => processoService.getById(id),
    enabled: !!id && enabled,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook para criar processo
 */
export function useCreateProcesso() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProcessoFormData) => processoService.create(data),
    onSuccess: (newItem) => {
      queryClient.invalidateQueries({ queryKey: processoQueryKeys.all });
      queryClient.setQueryData(processoQueryKeys.detail(newItem.id), newItem);
      toast.success('Processo criado com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao criar processo:', error);
      toast.error(error.message || 'Erro ao criar processo');
    },
  });
}

/**
 * Hook para atualizar processo
 */
export function useUpdateProcesso() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProcessoFormData }) =>
      processoService.update(id, data),
    onSuccess: (updatedItem, { id }) => {
      queryClient.invalidateQueries({ queryKey: processoQueryKeys.all });
      queryClient.setQueryData(processoQueryKeys.detail(id), updatedItem);
      toast.success('Processo atualizado com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao atualizar processo:', error);
      toast.error(error.message || 'Erro ao atualizar processo');
    },
  });
}

/**
 * Hook para deletar processo
 */
export function useDeleteProcesso() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => processoService.remove(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: processoQueryKeys.all });
      queryClient.removeQueries({ queryKey: processoQueryKeys.detail(id) });
      toast.success('Processo excluído com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao excluir processo:', error);
      toast.error(error.message || 'Erro ao excluir processo');
    },
  });
}