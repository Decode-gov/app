import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  useGetMfa,
  useGetMfaId,
  postMfaSetup,
  postMfaEnable,
  postMfaVerify,
  putMfaIdDisable,
  getGetMfaQueryKey,
  getGetMfaIdQueryKey,
} from '@/api/generated/endpoints/mfa/mfa';
import type {
  GetMfaParams,
  PostMfaSetupBody,
  PostMfaEnableBody,
  PostMfaVerifyBody,
  PutMfaIdDisableBody,
} from '@/api/generated/model';

export const mfaQueryKeys = {
  all: ['mfa'] as const,
  lists: () => [...mfaQueryKeys.all, 'list'] as const,
  list: (params?: GetMfaParams) => [...mfaQueryKeys.lists(), { params }] as const,
  details: () => [...mfaQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...mfaQueryKeys.details(), id] as const,
};

export function useMfas(params?: Record<string, unknown>) {
  return useGetMfa(params as GetMfaParams | undefined);
}

export function useMfa(id: string, enabled = true) {
  return useGetMfaId(id, { query: { enabled: !!id && enabled } });
}

export function useCreateMfa() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PostMfaSetupBody) => postMfaSetup(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetMfaQueryKey() });
      toast.success('MFA criado com sucesso!');
    },
    onError: () => toast.error('Erro ao criar MFA'),
  });
}

export function useUpdateMfa() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PutMfaIdDisableBody }) => putMfaIdDisable(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: getGetMfaQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetMfaIdQueryKey(id) });
      toast.success('MFA atualizado com sucesso!');
    },
    onError: () => toast.error('Erro ao atualizar MFA'),
  });
}

export function useDeleteMfa() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => Promise.resolve(id),
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: getGetMfaQueryKey() });
      queryClient.removeQueries({ queryKey: getGetMfaIdQueryKey(id) });
      toast.success('MFA excluído com sucesso!');
    },
    onError: () => toast.error('Erro ao excluir MFA'),
  });
}

export function useMfaSetup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PostMfaSetupBody) => postMfaSetup(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetMfaQueryKey() });
      toast.success('MFA configurado com sucesso!');
    },
    onError: () => toast.error('Erro ao configurar MFA'),
  });
}

export function useMfaEnable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PostMfaEnableBody) => postMfaEnable(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetMfaQueryKey() });
      toast.success('MFA ativado com sucesso!');
    },
    onError: () => toast.error('Erro ao ativar MFA'),
  });
}

export function useMfaVerify() {
  return useMutation({
    mutationFn: (data: PostMfaVerifyBody) => postMfaVerify(data),
    onError: () => toast.error('Código inválido'),
  });
}

export function useMfaDisable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PutMfaIdDisableBody }) => putMfaIdDisable(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetMfaQueryKey() });
      toast.success('MFA desativado com sucesso!');
    },
    onError: () => toast.error('Erro ao desativar MFA'),
  });
}
