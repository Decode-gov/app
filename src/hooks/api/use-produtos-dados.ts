import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  useGetProdutosDados,
  useGetProdutosDadosId,
  postProdutosDados,
  putProdutosDadosId,
  deleteProdutosDadosId,
  getGetProdutosDadosQueryKey,
  getGetProdutosDadosIdQueryKey,
} from '@/api/generated/endpoints/produtos-dados/produtos-dados';
import type {
  GetProdutosDadosParams,
  PostProdutosDadosBody,
  PutProdutosDadosIdBody,
} from '@/api/generated/model';

export const produtoDadosQueryKeys = {
  all: ['produtos-dados'] as const,
  lists: () => [...produtoDadosQueryKeys.all, 'list'] as const,
  list: (params?: GetProdutosDadosParams) => [...produtoDadosQueryKeys.lists(), { params }] as const,
  details: () => [...produtoDadosQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...produtoDadosQueryKeys.details(), id] as const,
};

export function useProdutosDados(params?: GetProdutosDadosParams) {
  return useGetProdutosDados(params);
}

export function useProdutoDadosDetail(id: string, enabled = true) {
  return useGetProdutosDadosId(id, { query: { enabled: !!id && enabled } });
}

export function useCreateProdutoDados() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PostProdutosDadosBody) => postProdutosDados(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetProdutosDadosQueryKey() });
      toast.success('Produto de dados criado com sucesso!');
    },
    onError: () => toast.error('Erro ao criar produto de dados'),
  });
}

export function useUpdateProdutoDados() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PutProdutosDadosIdBody }) =>
      putProdutosDadosId(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: getGetProdutosDadosQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetProdutosDadosIdQueryKey(id) });
      toast.success('Produto de dados atualizado com sucesso!');
    },
    onError: () => toast.error('Erro ao atualizar produto de dados'),
  });
}

export function useDeleteProdutoDados() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProdutosDadosId(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: getGetProdutosDadosQueryKey() });
      queryClient.removeQueries({ queryKey: getGetProdutosDadosIdQueryKey(id) });
      toast.success('Produto de dados excluído com sucesso!');
    },
    onError: () => toast.error('Erro ao excluir produto de dados'),
  });
}
