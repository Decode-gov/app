import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  useGetPoliticasInternas,
  useGetPoliticasInternasId,
  postPoliticasInternas,
  putPoliticasInternasId,
  deletePoliticasInternasId,
  getGetPoliticasInternasQueryKey,
  getGetPoliticasInternasIdQueryKey,
} from '@/api/generated/endpoints/politicas-internas/politicas-internas';
import type {
  GetPoliticasInternasParams,
  PostPoliticasInternasBody,
  PutPoliticasInternasIdBody,
} from '@/api/generated/model';

export const politicaInternaQueryKeys = {
  all: ['politicas-internas'] as const,
  lists: () => [...politicaInternaQueryKeys.all, 'list'] as const,
  list: (params?: GetPoliticasInternasParams) => [...politicaInternaQueryKeys.lists(), { params }] as const,
  details: () => [...politicaInternaQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...politicaInternaQueryKeys.details(), id] as const,
};

export function usePoliticasInternas(params?: Record<string, unknown>) {
  return useGetPoliticasInternas(params as GetPoliticasInternasParams | undefined);
}

export function usePoliticaInterna(id: string, enabled = true) {
  return useGetPoliticasInternasId(id, { query: { enabled: !!id && enabled } });
}

export function useCreatePoliticaInterna() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PostPoliticasInternasBody) => postPoliticasInternas(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetPoliticasInternasQueryKey() });
      toast.success('Política Interna criada com sucesso!');
    },
    onError: () => toast.error('Erro ao criar política interna'),
  });
}

export function useUpdatePoliticaInterna() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PutPoliticasInternasIdBody }) =>
      putPoliticasInternasId(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: getGetPoliticasInternasQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetPoliticasInternasIdQueryKey(id) });
      toast.success('Política Interna atualizada com sucesso!');
    },
    onError: () => toast.error('Erro ao atualizar política interna'),
  });
}

export function useDeletePoliticaInterna() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deletePoliticasInternasId(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: getGetPoliticasInternasQueryKey() });
      queryClient.removeQueries({ queryKey: getGetPoliticasInternasIdQueryKey(id) });
      toast.success('Política Interna excluída com sucesso!');
    },
    onError: () => toast.error('Erro ao excluir política interna'),
  });
}
