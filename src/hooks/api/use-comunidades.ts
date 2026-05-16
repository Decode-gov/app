import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  useGetComunidades,
  useGetComunidadesId,
  postComunidades,
  putComunidadesId,
  deleteComunidadesId,
  getGetComunidadesQueryKey,
  getGetComunidadesIdQueryKey,
} from '@/api/generated/endpoints/comunidades/comunidades';
import type { GetComunidadesParams, PostComunidadesBody, PutComunidadesIdBody } from '@/api/generated/model';

export const comunidadeQueryKeys = {
  all: ['comunidades'] as const,
  lists: () => [...comunidadeQueryKeys.all, 'list'] as const,
  list: (params?: GetComunidadesParams) => [...comunidadeQueryKeys.lists(), { params }] as const,
  details: () => [...comunidadeQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...comunidadeQueryKeys.details(), id] as const,
};

export function useComunidades(params?: Record<string, unknown>) {
  return useGetComunidades(params as GetComunidadesParams | undefined);
}

export function useComunidade(id: string, enabled = true) {
  return useGetComunidadesId(id, { query: { enabled: !!id && enabled } });
}

export function useCreateComunidade() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PostComunidadesBody) => postComunidades(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetComunidadesQueryKey() });
      toast.success('Comunidade criada com sucesso!');
    },
    onError: () => toast.error('Erro ao criar comunidade'),
  });
}

export function useUpdateComunidade() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PutComunidadesIdBody }) => putComunidadesId(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: getGetComunidadesQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetComunidadesIdQueryKey(id) });
      toast.success('Comunidade atualizada com sucesso!');
    },
    onError: () => toast.error('Erro ao atualizar comunidade'),
  });
}

export function useDeleteComunidade() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteComunidadesId(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: getGetComunidadesQueryKey() });
      queryClient.removeQueries({ queryKey: getGetComunidadesIdQueryKey(id) });
      toast.success('Comunidade excluída com sucesso!');
    },
    onError: () => toast.error('Erro ao excluir comunidade'),
  });
}
