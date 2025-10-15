/**
 * Hooks para gerenciamento de Documentos
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { documentoService } from '@/services';
import type { QueryParams, ApiError } from '@/types/api';
import type { CreateDocumentoFormData, UpdateDocumentoFormData } from '@/schemas';

/**
 * Chaves de query para documentos
 */
export const documentoQueryKeys = {
  all: ['documentos'] as const,
  lists: () => [...documentoQueryKeys.all, 'list'] as const,
  list: (params?: QueryParams) => [...documentoQueryKeys.lists(), { params }] as const,
  details: () => [...documentoQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...documentoQueryKeys.details(), id] as const,
};

/**
 * Hook para listar documentos com paginação
 */
export function useDocumentos(params?: QueryParams) {
  return useQuery({
    queryKey: documentoQueryKeys.list(params),
    queryFn: () => documentoService.list(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook para buscar um documento por ID
 */
export function useDocumentoDetail(id: string, enabled = true) {
  return useQuery({
    queryKey: documentoQueryKeys.detail(id),
    queryFn: () => documentoService.getById(id),
    enabled: !!id && enabled,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook para criar documento
 */
export function useCreateDocumento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDocumentoFormData) => documentoService.create(data),
    onSuccess: (newItem) => {
      queryClient.invalidateQueries({ queryKey: documentoQueryKeys.all });
      queryClient.setQueryData(documentoQueryKeys.detail(newItem.id), newItem);
      toast.success('Documento criado com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao criar documento:', error);
      toast.error(error.message || 'Erro ao criar documento');
    },
  });
}

/**
 * Hook para atualizar documento
 */
export function useUpdateDocumento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDocumentoFormData }) =>
      documentoService.update(id, data),
    onSuccess: (updatedItem, { id }) => {
      queryClient.invalidateQueries({ queryKey: documentoQueryKeys.all });
      queryClient.setQueryData(documentoQueryKeys.detail(id), updatedItem);
      toast.success('Documento atualizado com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao atualizar documento:', error);
      toast.error(error.message || 'Erro ao atualizar documento');
    },
  });
}

/**
 * Hook para deletar documento
 */
export function useDeleteDocumento() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => documentoService.remove(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: documentoQueryKeys.all });
      queryClient.removeQueries({ queryKey: documentoQueryKeys.detail(id) });
      toast.success('Documento excluído com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao excluir documento:', error);
      toast.error(error.message || 'Erro ao excluir documento');
    },
  });
}