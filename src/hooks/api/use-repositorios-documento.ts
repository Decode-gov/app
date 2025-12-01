import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { repositorioDocumentoService } from '@/services/repositorios-documento';
import {
  QueryParams,
  ApiError
} from '@/types/api';
import type { CreateRepositorioDocumentoFormData, UpdateRepositorioDocumentoFormData } from '@/schemas';

/**
 * Chaves de query para repositórios de documentos
 */
export const repositorioDocumentoQueryKeys = {
  all: ['repositorios-documento'] as const,
  lists: () => [...repositorioDocumentoQueryKeys.all, 'list'] as const,
  list: (params?: QueryParams) => [...repositorioDocumentoQueryKeys.lists(), { params }] as const,
  details: () => [...repositorioDocumentoQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...repositorioDocumentoQueryKeys.details(), id] as const,
};

/**
 * Hook para listar repositórios de documentos com paginação
 */
export function useRepositoriosDocumento(params?: QueryParams) {
  return useQuery({
    queryKey: repositorioDocumentoQueryKeys.list(params),
    queryFn: () => repositorioDocumentoService.list(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook para buscar um repositório de documentos por ID
 */
export function useRepositorioDocumento(id: string, enabled = true) {
  return useQuery({
    queryKey: repositorioDocumentoQueryKeys.detail(id),
    queryFn: () => repositorioDocumentoService.getById(id),
    enabled: !!id && enabled,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook para criar repositório de documentos
 */
export function useCreateRepositorioDocumento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRepositorioDocumentoFormData) => repositorioDocumentoService.create(data),
    onSuccess: (newItem) => {
      queryClient.invalidateQueries({ queryKey: repositorioDocumentoQueryKeys.all });
      queryClient.setQueryData(repositorioDocumentoQueryKeys.detail(newItem.id), newItem);
      toast.success('Repositório de documentos criado com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao criar repositório de documentos:', error);
      toast.error(error.message || 'Erro ao criar repositório de documentos');
    },
  });
}

/**
 * Hook para atualizar repositório de documentos
 */
export function useUpdateRepositorioDocumento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRepositorioDocumentoFormData }) =>
      repositorioDocumentoService.update(id, data),
    onSuccess: (updatedItem, { id }) => {
      queryClient.invalidateQueries({ queryKey: repositorioDocumentoQueryKeys.all });
      queryClient.setQueryData(repositorioDocumentoQueryKeys.detail(id), updatedItem);
      toast.success('Repositório de documentos atualizado com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao atualizar repositório de documentos:', error);
      toast.error(error.message || 'Erro ao atualizar repositório de documentos');
    },
  });
}

/**
 * Hook para deletar repositório de documentos
 */
export function useDeleteRepositorioDocumento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => repositorioDocumentoService.remove(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: repositorioDocumentoQueryKeys.all });
      queryClient.removeQueries({ queryKey: repositorioDocumentoQueryKeys.detail(id) });
      toast.success('Repositório de documentos excluído com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao excluir repositório de documentos:', error);
      toast.error(error.message || 'Erro ao excluir repositório de documentos');
    },
  });
}

