import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  useGetRepositoriosDocumento,
  useGetRepositoriosDocumentoId,
  postRepositoriosDocumento,
  putRepositoriosDocumentoId,
  deleteRepositoriosDocumentoId,
  getGetRepositoriosDocumentoQueryKey,
  getGetRepositoriosDocumentoIdQueryKey,
} from '@/api/generated/endpoints/repositorios-documento/repositorios-documento';
import type {
  GetRepositoriosDocumentoParams,
  PostRepositoriosDocumentoBody,
  PutRepositoriosDocumentoIdBody,
} from '@/api/generated/model';

export const repositorioDocumentoQueryKeys = {
  all: ['repositorios-documento'] as const,
  lists: () => [...repositorioDocumentoQueryKeys.all, 'list'] as const,
  list: (params?: GetRepositoriosDocumentoParams) => [...repositorioDocumentoQueryKeys.lists(), { params }] as const,
  details: () => [...repositorioDocumentoQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...repositorioDocumentoQueryKeys.details(), id] as const,
};

export function useRepositoriosDocumento(params?: GetRepositoriosDocumentoParams) {
  return useGetRepositoriosDocumento(params);
}

export function useRepositorioDocumento(id: string, enabled = true) {
  return useGetRepositoriosDocumentoId(id, { query: { enabled: !!id && enabled } });
}

export function useCreateRepositorioDocumento() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PostRepositoriosDocumentoBody) => postRepositoriosDocumento(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetRepositoriosDocumentoQueryKey() });
      toast.success('Repositório de documentos criado com sucesso!');
    },
    onError: () => toast.error('Erro ao criar repositório de documentos'),
  });
}

export function useUpdateRepositorioDocumento() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PutRepositoriosDocumentoIdBody }) =>
      putRepositoriosDocumentoId(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: getGetRepositoriosDocumentoQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetRepositoriosDocumentoIdQueryKey(id) });
      toast.success('Repositório de documentos atualizado com sucesso!');
    },
    onError: () => toast.error('Erro ao atualizar repositório de documentos'),
  });
}

export function useDeleteRepositorioDocumento() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteRepositoriosDocumentoId(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: getGetRepositoriosDocumentoQueryKey() });
      queryClient.removeQueries({ queryKey: getGetRepositoriosDocumentoIdQueryKey(id) });
      toast.success('Repositório de documentos excluído com sucesso!');
    },
    onError: () => toast.error('Erro ao excluir repositório de documentos'),
  });
}
