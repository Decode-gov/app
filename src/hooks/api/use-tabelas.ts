import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  useGetTabelas,
  useGetTabelasId,
  postTabelas,
  putTabelasId,
  deleteTabelasId,
  getGetTabelasQueryKey,
  getGetTabelasIdQueryKey,
} from '@/api/generated/endpoints/tabelas/tabelas';
import type { PostTabelasBody, PutTabelasIdBody } from '@/api/generated/model';

export const tabelaQueryKeys = {
  all: ['tabelas'] as const,
  lists: () => [...tabelaQueryKeys.all, 'list'] as const,
  list: () => [...tabelaQueryKeys.lists()] as const,
  details: () => [...tabelaQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...tabelaQueryKeys.details(), id] as const,
};

export function useTabelas(_params?: Record<string, unknown>) {
  return useGetTabelas();
}

export function useTabela(id: string, enabled = true) {
  return useGetTabelasId(id, { query: { enabled: !!id && enabled } });
}

export function useCreateTabela() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PostTabelasBody) => postTabelas(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetTabelasQueryKey() });
      toast.success('Tabela criada com sucesso!');
    },
    onError: () => toast.error('Erro ao criar tabela'),
  });
}

export function useUpdateTabela() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PutTabelasIdBody }) => putTabelasId(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: getGetTabelasQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetTabelasIdQueryKey(id) });
      toast.success('Tabela atualizada com sucesso!');
    },
    onError: () => toast.error('Erro ao atualizar tabela'),
  });
}

export function useDeleteTabela() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTabelasId(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: getGetTabelasQueryKey() });
      queryClient.removeQueries({ queryKey: getGetTabelasIdQueryKey(id) });
      toast.success('Tabela excluída com sucesso!');
    },
    onError: () => toast.error('Erro ao excluir tabela'),
  });
}
