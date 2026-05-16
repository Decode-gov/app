import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  useGetEmpresas,
  useGetEmpresasId,
  postEmpresas,
  putEmpresasId,
  getGetEmpresasQueryKey,
  getGetEmpresasIdQueryKey,
} from '@/api/generated/endpoints/empresas/empresas';
import type { PostEmpresasBody, PutEmpresasIdBody } from '@/api/generated/model';

export const empresaQueryKeys = {
  all: ['empresas'] as const,
  lists: () => [...empresaQueryKeys.all, 'list'] as const,
  list: () => [...empresaQueryKeys.lists()] as const,
};

export function useEmpresas(params?: unknown, enabled = true) {
  return useGetEmpresas({ query: { enabled } });
}

export function useEmpresa(id: string, enabled = true) {
  return useGetEmpresasId(id, { query: { enabled: !!id && enabled } });
}

export function useCreateEmpresa() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PostEmpresasBody) => postEmpresas(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetEmpresasQueryKey() });
      toast.success('Empresa criada com sucesso!');
    },
    onError: () => toast.error('Erro ao criar empresa'),
  });
}

export function useUpdateEmpresa() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PutEmpresasIdBody }) => putEmpresasId(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: getGetEmpresasQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetEmpresasIdQueryKey(id) });
      toast.success('Empresa atualizada com sucesso!');
    },
    onError: () => toast.error('Erro ao atualizar empresa'),
  });
}
