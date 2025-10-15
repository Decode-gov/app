import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { tabelaService } from '@/services/tabelas';
import { QueryParams, ApiError } from '@/types/api';
import type { CreateTabelaFormData, UpdateTabelaFormData } from '@/schemas';

/**
 * Chaves de query para tabelas
 */
export const tabelaQueryKeys = {
  all: ['tabelas'] as const,
  lists: () => [...tabelaQueryKeys.all, 'list'] as const,
  list: (params?: QueryParams) => [...tabelaQueryKeys.lists(), { params }] as const,
  details: () => [...tabelaQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...tabelaQueryKeys.details(), id] as const,
};

/**
 * Hook para listar tabelas com paginação
 */
export function useTabelas(params?: QueryParams) {
  return useQuery({
    queryKey: tabelaQueryKeys.list(params),
    queryFn: () => tabelaService.list(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook para buscar uma tabela por ID
 */
export function useTabela(id: string, enabled = true) {
  return useQuery({
    queryKey: tabelaQueryKeys.detail(id),
    queryFn: () => tabelaService.getById(id),
    enabled: !!id && enabled,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook para criar tabela
 */
export function useCreateTabela() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTabelaFormData) => tabelaService.create(data),
    onSuccess: (newItem) => {
      queryClient.invalidateQueries({ queryKey: tabelaQueryKeys.all });
      queryClient.setQueryData(tabelaQueryKeys.detail(newItem.id), newItem);
      toast.success('Tabela criada com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao criar tabela:', error);
      toast.error(error.message || 'Erro ao criar tabela');
    },
  });
}

/**
 * Hook para atualizar tabela
 */
export function useUpdateTabela() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTabelaFormData }) =>
      tabelaService.update(id, data),
    onSuccess: (updatedItem, { id }) => {
      queryClient.invalidateQueries({ queryKey: tabelaQueryKeys.all });
      queryClient.setQueryData(tabelaQueryKeys.detail(id), updatedItem);
      toast.success('Tabela atualizada com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao atualizar tabela:', error);
      toast.error(error.message || 'Erro ao atualizar tabela');
    },
  });
}

/**
 * Hook para deletar tabela
 */
export function useDeleteTabela() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tabelaService.remove(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: tabelaQueryKeys.all });
      queryClient.removeQueries({ queryKey: tabelaQueryKeys.detail(id) });
      toast.success('Tabela excluída com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao excluir tabela:', error);
      toast.error(error.message || 'Erro ao excluir tabela');
    },
  });
}