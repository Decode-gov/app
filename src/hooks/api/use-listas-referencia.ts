import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  useGetListasReferencia,
  useGetListasReferenciaId,
  postListasReferencia,
  putListasReferenciaId,
  deleteListasReferenciaId,
  getGetListasReferenciaQueryKey,
  getGetListasReferenciaIdQueryKey,
} from '@/api/generated/endpoints/listas-referencia/listas-referencia';
import type {
  GetListasReferenciaParams,
  PostListasReferenciaBody,
  PutListasReferenciaIdBody,
} from '@/api/generated/model';

export const listaReferenciaQueryKeys = {
  all: ['listas-referencia'] as const,
  lists: () => [...listaReferenciaQueryKeys.all, 'list'] as const,
  list: (params?: GetListasReferenciaParams) => [...listaReferenciaQueryKeys.lists(), { params }] as const,
  details: () => [...listaReferenciaQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...listaReferenciaQueryKeys.details(), id] as const,
};

export function useListasReferencia(params?: Record<string, unknown>) {
  return useGetListasReferencia(params as GetListasReferenciaParams | undefined);
}

export function useListaReferencia(id: string, enabled = true) {
  return useGetListasReferenciaId(id, { query: { enabled: !!id && enabled } });
}

export function useCreateListaReferencia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PostListasReferenciaBody) => postListasReferencia(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetListasReferenciaQueryKey() });
      toast.success('Lista de referência criada com sucesso!');
    },
    onError: () => toast.error('Erro ao criar lista de referência'),
  });
}

export function useUpdateListaReferencia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PutListasReferenciaIdBody }) =>
      putListasReferenciaId(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: getGetListasReferenciaQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetListasReferenciaIdQueryKey(id) });
      toast.success('Lista de referência atualizada com sucesso!');
    },
    onError: () => toast.error('Erro ao atualizar lista de referência'),
  });
}

export function useDeleteListaReferencia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteListasReferenciaId(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: getGetListasReferenciaQueryKey() });
      queryClient.removeQueries({ queryKey: getGetListasReferenciaIdQueryKey(id) });
      toast.success('Lista de referência excluída com sucesso!');
    },
    onError: () => toast.error('Erro ao excluir lista de referência'),
  });
}
