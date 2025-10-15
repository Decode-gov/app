import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { parteEnvolvidaService } from '@/services/partes-envolvidas';
import { QueryParams, ApiError } from '@/types/api';
import type { CreateParteEnvolvidaFormData, UpdateParteEnvolvidaFormData } from '@/schemas';

/**
 * Chaves de query para partes envolvidas
 */
export const parteEnvolvidaQueryKeys = {
  all: ['partes-envolvidas'] as const,
  lists: () => [...parteEnvolvidaQueryKeys.all, 'list'] as const,
  list: (params?: QueryParams) => [...parteEnvolvidaQueryKeys.lists(), { params }] as const,
  details: () => [...parteEnvolvidaQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...parteEnvolvidaQueryKeys.details(), id] as const,
};

/**
 * Hook para listar partes envolvidas com paginação
 */
export function usePartesEnvolvidas(params?: QueryParams) {
  return useQuery({
    queryKey: parteEnvolvidaQueryKeys.list(params),
    queryFn: () => parteEnvolvidaService.list(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook para buscar uma parte envolvida por ID
 */
export function useParteEnvolvida(id: string, enabled = true) {
  return useQuery({
    queryKey: parteEnvolvidaQueryKeys.detail(id),
    queryFn: () => parteEnvolvidaService.getById(id),
    enabled: !!id && enabled,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook para criar parte envolvida
 */
export function useCreateParteEnvolvida() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateParteEnvolvidaFormData) => parteEnvolvidaService.create(data),
    onSuccess: (newItem) => {
      queryClient.invalidateQueries({ queryKey: parteEnvolvidaQueryKeys.all });
      queryClient.setQueryData(parteEnvolvidaQueryKeys.detail(newItem.id), newItem);
      toast.success('Parte envolvida criada com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao criar parte envolvida:', error);
      toast.error(error.message || 'Erro ao criar parte envolvida');
    },
  });
}

/**
 * Hook para atualizar parte envolvida
 */
export function useUpdateParteEnvolvida() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateParteEnvolvidaFormData }) =>
      parteEnvolvidaService.update(id, data),
    onSuccess: (updatedItem, { id }) => {
      queryClient.invalidateQueries({ queryKey: parteEnvolvidaQueryKeys.all });
      queryClient.setQueryData(parteEnvolvidaQueryKeys.detail(id), updatedItem);
      toast.success('Parte envolvida atualizada com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao atualizar parte envolvida:', error);
      toast.error(error.message || 'Erro ao atualizar parte envolvida');
    },
  });
}

/**
 * Hook para deletar parte envolvida
 */
export function useDeleteParteEnvolvida() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => parteEnvolvidaService.remove(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: parteEnvolvidaQueryKeys.all });
      queryClient.removeQueries({ queryKey: parteEnvolvidaQueryKeys.detail(id) });
      toast.success('Parte envolvida excluída com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao excluir parte envolvida:', error);
      toast.error(error.message || 'Erro ao excluir parte envolvida');
    },
  });
}