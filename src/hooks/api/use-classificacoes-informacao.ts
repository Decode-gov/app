import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { classificacaoService } from '@/services/classificacoes-informacao';
import { QueryParams, ApiError } from '@/types/api';
import type { CreateClassificacaoInformacaoFormData, UpdateClassificacaoInformacaoFormData } from '@/schemas';

/**
 * Chaves de query para classificações de informação
 */
export const classificacaoQueryKeys = {
  all: ['classificacoes'] as const,
  lists: () => [...classificacaoQueryKeys.all, 'list'] as const,
  list: (params?: QueryParams) => [...classificacaoQueryKeys.lists(), { params }] as const,
  listAll: () => [...classificacaoQueryKeys.all, 'todas'] as const,
  details: () => [...classificacaoQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...classificacaoQueryKeys.details(), id] as const,
};

/**
 * Hook para listar classificações de informação com paginação
 */
export function useClassificacoes(params?: QueryParams) {
  return useQuery({
    queryKey: classificacaoQueryKeys.list(params),
    queryFn: () => classificacaoService.list(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook para listar todas as classificações (sem paginação)
 */
export function useClassificacoesTodas() {
  return useQuery({
    queryKey: classificacaoQueryKeys.listAll(),
    queryFn: () => classificacaoService.listAll(),
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
}

/**
 * Hook para buscar uma classificação de informação por ID
 */
export function useClassificacao(id: string, enabled = true) {
  return useQuery({
    queryKey: classificacaoQueryKeys.detail(id),
    queryFn: () => classificacaoService.getById(id),
    enabled: !!id && enabled,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook para criar classificação de informação
 */
export function useCreateClassificacao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateClassificacaoInformacaoFormData) => classificacaoService.create(data),
    onSuccess: (newItem) => {
      queryClient.invalidateQueries({ queryKey: classificacaoQueryKeys.all });
      queryClient.setQueryData(classificacaoQueryKeys.detail(newItem.id), newItem);
      toast.success('Classificação de informação criada com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao criar classificação de informação:', error);
      toast.error(error.message || 'Erro ao criar classificação de informação');
    },
  });
}

/**
 * Hook para atualizar classificação de informação
 */
export function useUpdateClassificacao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateClassificacaoInformacaoFormData }) =>
      classificacaoService.update(id, data),
    onSuccess: (updatedItem, { id }) => {
      queryClient.invalidateQueries({ queryKey: classificacaoQueryKeys.all });
      queryClient.setQueryData(classificacaoQueryKeys.detail(id), updatedItem);
      toast.success('Classificação de informação atualizada com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao atualizar classificação de informação:', error);
      toast.error(error.message || 'Erro ao atualizar classificação de informação');
    },
  });
}

/**
 * Hook para deletar classificação de informação
 */
export function useDeleteClassificacao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => classificacaoService.remove(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: classificacaoQueryKeys.all });
      queryClient.removeQueries({ queryKey: classificacaoQueryKeys.detail(id) });
      toast.success('Classificação de informação excluída com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao excluir classificação de informação:', error);
      toast.error(error.message || 'Erro ao excluir classificação de informação');
    },
  });
}

/**
 * Hook para atualizar apenas o termo de uma classificação
 */
export function useUpdateTermoClassificacao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, termoId }: { id: string; termoId: string }) =>
      classificacaoService.updateTermo(id, { termoId }),
    onSuccess: (updatedItem, { id }) => {
      queryClient.invalidateQueries({ queryKey: classificacaoQueryKeys.all });
      queryClient.setQueryData(classificacaoQueryKeys.detail(id), updatedItem);
      toast.success('Termo da classificação atualizado com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao atualizar termo da classificação:', error);
      toast.error(error.message || 'Erro ao atualizar termo da classificação');
    },
  });
}

/**
 * Hook para atribuir termo a uma classificação
 */
export function useAtribuirTermoClassificacao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, termoId }: { id: string; termoId: string }) =>
      classificacaoService.atribuirTermo(id, termoId),
    onSuccess: (updatedItem, { id }) => {
      queryClient.invalidateQueries({ queryKey: classificacaoQueryKeys.all });
      queryClient.setQueryData(classificacaoQueryKeys.detail(id), updatedItem);
      toast.success('Termo atribuído à classificação com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao atribuir termo à classificação:', error);
      toast.error(error.message || 'Erro ao atribuir termo à classificação');
    },
  });
}