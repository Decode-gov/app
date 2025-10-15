import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { bancoService } from '@/services/bancos';
import { QueryParams, ApiError } from '@/types/api';
import type { CreateBancoFormData, UpdateBancoFormData } from '@/schemas';

/**
 * Chaves de query para bancos de dados
 */
export const bancoQueryKeys = {
  all: ['bancos'] as const,
  lists: () => [...bancoQueryKeys.all, 'list'] as const,
  list: (params?: QueryParams) => [...bancoQueryKeys.lists(), { params }] as const,
  details: () => [...bancoQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...bancoQueryKeys.details(), id] as const,
};

/**
 * Hook para listar bancos de dados com paginação
 */
export function useBancos(params?: QueryParams) {
  return useQuery({
    queryKey: bancoQueryKeys.list(params),
    queryFn: () => bancoService.list(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook para buscar um banco de dados por ID
 */
export function useBanco(id: string, enabled = true) {
  return useQuery({
    queryKey: bancoQueryKeys.detail(id),
    queryFn: () => bancoService.getById(id),
    enabled: !!id && enabled,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook para criar banco de dados
 */
export function useCreateBanco() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBancoFormData) => bancoService.create(data),
    onSuccess: (newItem) => {
      queryClient.invalidateQueries({ queryKey: bancoQueryKeys.all });
      queryClient.setQueryData(bancoQueryKeys.detail(newItem.id), newItem);
      toast.success('Banco de dados criado com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao criar banco de dados:', error);
      toast.error(error.message || 'Erro ao criar banco de dados');
    },
  });
}

/**
 * Hook para atualizar banco de dados
 */
export function useUpdateBanco() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBancoFormData }) =>
      bancoService.update(id, data),
    onSuccess: (updatedItem, { id }) => {
      queryClient.invalidateQueries({ queryKey: bancoQueryKeys.all });
      queryClient.setQueryData(bancoQueryKeys.detail(id), updatedItem);
      toast.success('Banco de dados atualizado com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao atualizar banco de dados:', error);
      toast.error(error.message || 'Erro ao atualizar banco de dados');
    },
  });
}

/**
 * Hook para deletar banco de dados
 */
export function useDeleteBanco() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => bancoService.remove(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: bancoQueryKeys.all });
      queryClient.removeQueries({ queryKey: bancoQueryKeys.detail(id) });
      toast.success('Banco de dados excluído com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao excluir banco de dados:', error);
      toast.error(error.message || 'Erro ao excluir banco de dados');
    },
  });
}