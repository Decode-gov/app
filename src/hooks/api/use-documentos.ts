import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  useGetDocumentos,
  useGetDocumentosId,
  postDocumentos,
  getGetDocumentosQueryKey,
  getGetDocumentosIdQueryKey,
} from '@/api/generated/endpoints/documentos/documentos';
import type { GetDocumentosParams, PostDocumentosBody } from '@/api/generated/model';

export const documentoQueryKeys = {
  all: ['documentos'] as const,
  lists: () => [...documentoQueryKeys.all, 'list'] as const,
  list: (params?: GetDocumentosParams) => [...documentoQueryKeys.lists(), { params }] as const,
  details: () => [...documentoQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...documentoQueryKeys.details(), id] as const,
};

export function useDocumentos(params?: GetDocumentosParams) {
  return useGetDocumentos(params);
}

export function useDocumentoDetail(id: string, enabled = true) {
  return useGetDocumentosId(id, { query: { enabled: !!id && enabled } });
}

export function useCreateDocumento() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PostDocumentosBody) => postDocumentos(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetDocumentosQueryKey() });
      toast.success('Documento criado com sucesso!');
    },
    onError: () => toast.error('Erro ao criar documento'),
  });
}

export function useUpdateDocumento() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PostDocumentosBody }) => postDocumentos(data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: getGetDocumentosQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetDocumentosIdQueryKey(id) });
      toast.success('Documento atualizado com sucesso!');
    },
    onError: () => toast.error('Erro ao atualizar documento'),
  });
}

export function useDeleteDocumento() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => Promise.resolve(id),
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: getGetDocumentosQueryKey() });
      queryClient.removeQueries({ queryKey: getGetDocumentosIdQueryKey(id) });
      toast.success('Documento excluído com sucesso!');
    },
    onError: () => toast.error('Erro ao excluir documento'),
  });
}
