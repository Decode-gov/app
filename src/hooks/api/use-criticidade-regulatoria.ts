import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  useGetCriticidadesRegulatorias,
  useGetCriticidadesRegulatoriasId,
  postCriticidadesRegulatorias,
  putCriticidadesRegulatoriasId,
  deleteCriticidadesRegulatoriasId,
  getGetCriticidadesRegulatoriasQueryKey,
  getGetCriticidadesRegulatoriasIdQueryKey,
} from '@/api/generated/endpoints/criticidade-regulatoria/criticidade-regulatoria';
import type {
  GetCriticidadesRegulatoriasParams,
  PostCriticidadesRegulatoriasBody,
  PutCriticidadesRegulatoriasIdBody,
} from '@/api/generated/model';

export const criticidadeRegulatoriaQueryKeys = {
  all: ['criticidade-regulatoria'] as const,
  lists: () => [...criticidadeRegulatoriaQueryKeys.all, 'list'] as const,
  list: (params?: GetCriticidadesRegulatoriasParams) => [...criticidadeRegulatoriaQueryKeys.lists(), { params }] as const,
  details: () => [...criticidadeRegulatoriaQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...criticidadeRegulatoriaQueryKeys.details(), id] as const,
};

export function useCriticidadesRegulatoria(params?: GetCriticidadesRegulatoriasParams) {
  return useGetCriticidadesRegulatorias(params);
}

export function useCriticidadeRegulatoria(id: string, enabled = true) {
  return useGetCriticidadesRegulatoriasId(id, { query: { enabled: !!id && enabled } });
}

export function useCreateCriticidadeRegulatoria() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PostCriticidadesRegulatoriasBody) => postCriticidadesRegulatorias(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetCriticidadesRegulatoriasQueryKey() });
      toast.success('Criticidade regulatória criada com sucesso!');
    },
    onError: () => toast.error('Erro ao criar criticidade regulatória'),
  });
}

export function useUpdateCriticidadeRegulatoria() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PutCriticidadesRegulatoriasIdBody }) =>
      putCriticidadesRegulatoriasId(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: getGetCriticidadesRegulatoriasQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetCriticidadesRegulatoriasIdQueryKey(id) });
      toast.success('Criticidade regulatória atualizada com sucesso!');
    },
    onError: () => toast.error('Erro ao atualizar criticidade regulatória'),
  });
}

export function useDeleteCriticidadeRegulatoria() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCriticidadesRegulatoriasId(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: getGetCriticidadesRegulatoriasQueryKey() });
      queryClient.removeQueries({ queryKey: getGetCriticidadesRegulatoriasIdQueryKey(id) });
      toast.success('Criticidade regulatória excluída com sucesso!');
    },
    onError: () => toast.error('Erro ao excluir criticidade regulatória'),
  });
}
