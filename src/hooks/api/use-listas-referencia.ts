import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { listaReferenciaService } from '@/services/listas-referencia';
import { QueryParams, ApiError } from '@/types/api';
import type { CreateListaReferenciaFormData, UpdateListaReferenciaFormData } from '@/schemas';

/**
 * Chaves de query para listas de referência
 */
export const listaReferenciaQueryKeys = {
  all: ['listas-referencia'] as const,
  lists: () => [...listaReferenciaQueryKeys.all, 'list'] as const,
  list: (params?: QueryParams) => [...listaReferenciaQueryKeys.lists(), { params }] as const,
  details: () => [...listaReferenciaQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...listaReferenciaQueryKeys.details(), id] as const,
};

/**
 * Hook para listar listas de referência com paginação
 */
export function useListasReferencia(params?: QueryParams) {
  return useQuery({
    queryKey: listaReferenciaQueryKeys.list(params),
    queryFn: () => listaReferenciaService.list(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook para buscar uma lista de referência por ID
 */
export function useListaReferencia(id: string, enabled = true) {
  return useQuery({
    queryKey: listaReferenciaQueryKeys.detail(id),
    queryFn: () => listaReferenciaService.getById(id),
    enabled: !!id && enabled,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook para criar lista de referência
 */
export function useCreateListaReferencia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateListaReferenciaFormData) => listaReferenciaService.create(data),
    onSuccess: (newItem) => {
      queryClient.invalidateQueries({ queryKey: listaReferenciaQueryKeys.all });
      queryClient.setQueryData(listaReferenciaQueryKeys.detail(newItem.id), newItem);
      toast.success('Lista de referência criada com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao criar lista de referência:', error);
      toast.error(error.message || 'Erro ao criar lista de referência');
    },
  });
}

/**
 * Hook para atualizar lista de referência
 */
export function useUpdateListaReferencia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateListaReferenciaFormData }) =>
      listaReferenciaService.update(id, data),
    onSuccess: (updatedItem, { id }) => {
      queryClient.invalidateQueries({ queryKey: listaReferenciaQueryKeys.all });
      queryClient.setQueryData(listaReferenciaQueryKeys.detail(id), updatedItem);
      toast.success('Lista de referência atualizada com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao atualizar lista de referência:', error);
      toast.error(error.message || 'Erro ao atualizar lista de referência');
    },
  });
}

/**
 * Hook para deletar lista de referência
 */
export function useDeleteListaReferencia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => listaReferenciaService.remove(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: listaReferenciaQueryKeys.all });
      queryClient.removeQueries({ queryKey: listaReferenciaQueryKeys.detail(id) });
      toast.success('Lista de referência excluída com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao excluir lista de referência:', error);
      toast.error(error.message || 'Erro ao excluir lista de referência');
    },
  });
}