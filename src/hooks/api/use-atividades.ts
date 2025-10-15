import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { atividadeService } from '@/services/atividades';
import { QueryParams, ApiError } from '@/types/api';
import type { CreateAtividadeFormData, UpdateAtividadeFormData } from '@/schemas';

/**
 * Chaves de query para atividades
 */
export const atividadeQueryKeys = {
  all: ['atividades'] as const,
  lists: () => [...atividadeQueryKeys.all, 'list'] as const,
  list: (params?: QueryParams) => [...atividadeQueryKeys.lists(), { params }] as const,
  details: () => [...atividadeQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...atividadeQueryKeys.details(), id] as const,
};

/**
 * Hook para listar atividades com paginação
 */
export function useAtividades(params?: QueryParams) {
  return useQuery({
    queryKey: atividadeQueryKeys.list(params),
    queryFn: () => atividadeService.list(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook para buscar uma atividade por ID
 */
export function useAtividade(id: string, enabled = true) {
  return useQuery({
    queryKey: atividadeQueryKeys.detail(id),
    queryFn: () => atividadeService.getById(id),
    enabled: !!id && enabled,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook para criar atividade
 */
export function useCreateAtividade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAtividadeFormData) => atividadeService.create(data),
    onSuccess: (newItem) => {
      queryClient.invalidateQueries({ queryKey: atividadeQueryKeys.all });
      queryClient.setQueryData(atividadeQueryKeys.detail(newItem.id), newItem);
      toast.success('Atividade criada com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao criar atividade:', error);
      toast.error(error.message || 'Erro ao criar atividade');
    },
  });
}

/**
 * Hook para atualizar atividade
 */
export function useUpdateAtividade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAtividadeFormData }) =>
      atividadeService.update(id, data),
    onSuccess: (updatedItem, { id }) => {
      queryClient.invalidateQueries({ queryKey: atividadeQueryKeys.all });
      queryClient.setQueryData(atividadeQueryKeys.detail(id), updatedItem);
      toast.success('Atividade atualizada com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao atualizar atividade:', error);
      toast.error(error.message || 'Erro ao atualizar atividade');
    },
  });
}

/**
 * Hook para deletar atividade
 */
export function useDeleteAtividade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => atividadeService.remove(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: atividadeQueryKeys.all });
      queryClient.removeQueries({ queryKey: atividadeQueryKeys.detail(id) });
      toast.success('Atividade excluída com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao excluir atividade:', error);
      toast.error(error.message || 'Erro ao excluir atividade');
    },
  });
}