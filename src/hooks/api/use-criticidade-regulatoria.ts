import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { criticidadeRegulatoriaService } from '@/services/criticidade-regulatoria';
import { QueryParams, ApiError } from '@/types/api';
import type { CreateCriticidadeRegulatoriaFormData, UpdateCriticidadeRegulatoriaFormData } from '@/schemas';

/**
 * Chaves de query para criticidade regulatória
 */
export const criticidadeRegulatoriaQueryKeys = {
  all: ['criticidade-regulatoria'] as const,
  lists: () => [...criticidadeRegulatoriaQueryKeys.all, 'list'] as const,
  list: (params?: QueryParams) => [...criticidadeRegulatoriaQueryKeys.lists(), { params }] as const,
  details: () => [...criticidadeRegulatoriaQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...criticidadeRegulatoriaQueryKeys.details(), id] as const,
};

/**
 * Hook para listar criticidades regulatórias com paginação
 */
export function useCriticidadesRegulatoria(params?: QueryParams) {
  return useQuery({
    queryKey: criticidadeRegulatoriaQueryKeys.list(params),
    queryFn: () => criticidadeRegulatoriaService.list(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook para buscar uma criticidade regulatória por ID
 */
export function useCriticidadeRegulatoria(id: string, enabled = true) {
  return useQuery({
    queryKey: criticidadeRegulatoriaQueryKeys.detail(id),
    queryFn: () => criticidadeRegulatoriaService.getById(id),
    enabled: !!id && enabled,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook para criar criticidade regulatória
 */
export function useCreateCriticidadeRegulatoria() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCriticidadeRegulatoriaFormData) => criticidadeRegulatoriaService.create(data),
    onSuccess: (newItem) => {
      queryClient.invalidateQueries({ queryKey: criticidadeRegulatoriaQueryKeys.all });
      queryClient.setQueryData(criticidadeRegulatoriaQueryKeys.detail(newItem.id), newItem);
      toast.success('Criticidade regulatória criada com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao criar criticidade regulatória:', error);
      toast.error(error.message || 'Erro ao criar criticidade regulatória');
    },
  });
}

/**
 * Hook para atualizar criticidade regulatória
 */
export function useUpdateCriticidadeRegulatoria() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCriticidadeRegulatoriaFormData }) =>
      criticidadeRegulatoriaService.update(id, data),
    onSuccess: (updatedItem, { id }) => {
      queryClient.invalidateQueries({ queryKey: criticidadeRegulatoriaQueryKeys.all });
      queryClient.setQueryData(criticidadeRegulatoriaQueryKeys.detail(id), updatedItem);
      toast.success('Criticidade regulatória atualizada com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao atualizar criticidade regulatória:', error);
      toast.error(error.message || 'Erro ao atualizar criticidade regulatória');
    },
  });
}

/**
 * Hook para deletar criticidade regulatória
 */
export function useDeleteCriticidadeRegulatoria() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => criticidadeRegulatoriaService.remove(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: criticidadeRegulatoriaQueryKeys.all });
      queryClient.removeQueries({ queryKey: criticidadeRegulatoriaQueryKeys.detail(id) });
      toast.success('Criticidade regulatória excluída com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao excluir criticidade regulatória:', error);
      toast.error(error.message || 'Erro ao excluir criticidade regulatória');
    },
  });
}