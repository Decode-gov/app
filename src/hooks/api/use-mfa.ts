import { useQuery, useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { toast } from 'sonner';
import { mfaService } from '@/services/mfa';
import { MfaResponse, MfaSetupResponse, QueryParams, ApiError } from '@/types/api';
import type { MfaFormData, MfaVerifyFormData } from '@/schemas';

/**
 * Chaves de query para MFA
 */
export const mfaQueryKeys = {
  all: ['mfa'] as const,
  lists: () => [...mfaQueryKeys.all, 'list'] as const,
  list: (params?: QueryParams) => [...mfaQueryKeys.lists(), { params }] as const,
  details: () => [...mfaQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...mfaQueryKeys.details(), id] as const,
};

/**
 * Hook para listar MFAs com paginação
 */
export function useMfas(params?: QueryParams) {
  return useQuery({
    queryKey: mfaQueryKeys.list(params),
    queryFn: () => mfaService.list(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook para buscar um MFA por ID
 */
export function useMfa(id: string, enabled = true) {
  return useQuery({
    queryKey: mfaQueryKeys.detail(id),
    queryFn: () => mfaService.getById(id),
    enabled: !!id && enabled,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook para criar MFA
 */
export function useCreateMfa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MfaFormData) => mfaService.create(data),
    onSuccess: (newItem) => {
      queryClient.invalidateQueries({ queryKey: mfaQueryKeys.all });
      queryClient.setQueryData(mfaQueryKeys.detail(newItem.id), newItem);
      toast.success('MFA criado com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao criar MFA:', error);
      toast.error(error.message || 'Erro ao criar MFA');
    },
  });
}

/**
 * Hook para atualizar MFA
 */
export function useUpdateMfa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: MfaFormData }) =>
      mfaService.update(id, data),
    onSuccess: (updatedItem, { id }) => {
      queryClient.invalidateQueries({ queryKey: mfaQueryKeys.all });
      queryClient.setQueryData(mfaQueryKeys.detail(id), updatedItem);
      toast.success('MFA atualizado com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao atualizar MFA:', error);
      toast.error(error.message || 'Erro ao atualizar MFA');
    },
  });
}

/**
 * Hook para deletar MFA
 */
export function useDeleteMfa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => mfaService.remove(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: mfaQueryKeys.all });
      queryClient.removeQueries({ queryKey: mfaQueryKeys.detail(id) });
      toast.success('MFA excluído com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao excluir MFA:', error);
      toast.error(error.message || 'Erro ao excluir MFA');
    },
  });
}

/**
 * Hook para configurar MFA
 */
export function useMfaSetup(): UseMutationResult<MfaSetupResponse, ApiError, void> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => mfaService.setup(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mfaQueryKeys.all });
      toast.success('MFA configurado com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao configurar MFA:', error);
      toast.error(error.message || 'Erro ao configurar MFA');
    },
  });
}

/**
 * Hook para ativar MFA
 */
export function useMfaEnable(): UseMutationResult<MfaResponse, ApiError, MfaVerifyFormData> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MfaVerifyFormData) => mfaService.enable(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mfaQueryKeys.all });
      toast.success('MFA ativado com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao ativar MFA:', error);
      toast.error(error.message || 'Erro ao ativar MFA');
    },
  });
}

/**
 * Hook para verificar código MFA
 */
export function useMfaVerify(): UseMutationResult<{ valid: boolean }, ApiError, MfaVerifyFormData> {
  return useMutation({
    mutationFn: (data: MfaVerifyFormData) => mfaService.verify(data),
    onError: (error: ApiError) => {
      console.error('Erro ao verificar MFA:', error);
      toast.error(error.message || 'Código inválido');
    },
  });
}

/**
 * Hook para desativar MFA
 */
export function useMfaDisable(): UseMutationResult<void, ApiError, void> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => mfaService.disable(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mfaQueryKeys.all });
      toast.success('MFA desativado com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao desativar MFA:', error);
      toast.error(error.message || 'Erro ao desativar MFA');
    },
  });
}