import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  useGetAtividades,
  useGetAtividadesId,
  postAtividades,
  putAtividadesId,
  deleteAtividadesId,
  getGetAtividadesQueryKey,
  getGetAtividadesIdQueryKey,
} from '@/api/generated/endpoints/atividades/atividades';
import type { GetAtividadesParams, PostAtividadesBody, PutAtividadesIdBody } from '@/api/generated/model';

export const atividadeQueryKeys = {
  all: ['atividades'] as const,
  lists: () => [...atividadeQueryKeys.all, 'list'] as const,
  list: (params?: GetAtividadesParams) => [...atividadeQueryKeys.lists(), { params }] as const,
  details: () => [...atividadeQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...atividadeQueryKeys.details(), id] as const,
};

export function useAtividades(params?: Record<string, unknown>) {
  return useGetAtividades(params as GetAtividadesParams | undefined);
}

export function useAtividade(id: string, enabled = true) {
  return useGetAtividadesId(id, { query: { enabled: !!id && enabled } });
}

export function useCreateAtividade() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PostAtividadesBody) => postAtividades(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetAtividadesQueryKey() });
      toast.success('Atividade criada com sucesso!');
    },
    onError: () => toast.error('Erro ao criar atividade'),
  });
}

export function useUpdateAtividade() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PutAtividadesIdBody }) => putAtividadesId(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: getGetAtividadesQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetAtividadesIdQueryKey(id) });
      toast.success('Atividade atualizada com sucesso!');
    },
    onError: () => toast.error('Erro ao atualizar atividade'),
  });
}

export function useDeleteAtividade() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAtividadesId(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: getGetAtividadesQueryKey() });
      queryClient.removeQueries({ queryKey: getGetAtividadesIdQueryKey(id) });
      toast.success('Atividade excluída com sucesso!');
    },
    onError: () => toast.error('Erro ao excluir atividade'),
  });
}
