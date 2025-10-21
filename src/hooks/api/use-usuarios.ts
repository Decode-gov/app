import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { usuarioService, LoginBody, RegisterBody, ChangePasswordBody, LoginResponse } from '@/services/usuarios';
import { CreateUsuarioBody, UpdateUsuarioBody, QueryParams, ApiError } from '@/types/api';

/**
 * Chaves de query para usuários
 */
export const usuarioQueryKeys = {
  all: ['usuarios'] as const,
  lists: () => [...usuarioQueryKeys.all, 'list'] as const,
  list: (params?: QueryParams) => [...usuarioQueryKeys.lists(), { params }] as const,
  details: () => [...usuarioQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...usuarioQueryKeys.details(), id] as const,
};

/**
 * Hook para listar usuários com paginação
 */
export function useUsuarios(params?: QueryParams) {
  return useQuery({
    queryKey: usuarioQueryKeys.list(params),
    queryFn: () => usuarioService.list(params),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
}

/**
 * Hook para buscar um usuário por ID
 */
export function useUsuario(id: string, enabled = true) {
  return useQuery({
    queryKey: usuarioQueryKeys.detail(id),
    queryFn: () => usuarioService.getById(id),
    enabled: !!id && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

/**
 * Hook para criar usuário
 */
export function useCreateUsuario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterBody) => usuarioService.register(data),
    onSuccess: (newItem) => {
      queryClient.invalidateQueries({ queryKey: usuarioQueryKeys.all });
      queryClient.setQueryData(usuarioQueryKeys.detail(newItem.id), newItem);
      toast.success('Usuário criado com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao criar usuário:', error);
      toast.error(error.message || 'Erro ao criar usuário');
    },
  });
}

/**
 * Hook para atualizar usuário
 */
export function useUpdateUsuario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUsuarioBody }) =>
      usuarioService.update(id, data),
    onSuccess: (updatedItem, { id }) => {
      queryClient.invalidateQueries({ queryKey: usuarioQueryKeys.all });
      queryClient.setQueryData(usuarioQueryKeys.detail(id), updatedItem);
      toast.success('Usuário atualizado com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao atualizar usuário:', error);
      toast.error(error.message || 'Erro ao atualizar usuário');
    },
  });
}

/**
 * Hook para deletar usuário
 */
export function useDeleteUsuario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usuarioService.remove(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: usuarioQueryKeys.all });
      queryClient.removeQueries({ queryKey: usuarioQueryKeys.detail(id) });
      toast.success('Usuário excluído com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao excluir usuário:', error);
      toast.error(error.message || 'Erro ao excluir usuário');
    },
  });
}

/**
 * Hooks específicos de autenticação (não fazem parte do CRUD padrão)
 */

/**
 * Hook para login
 */
export function useLogin() {
  return useMutation({
    mutationFn: (data: LoginBody) => usuarioService.login(data),
    onSuccess: () => {
      toast.success('Login realizado com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro no login:', error);
      toast.error(error.message || 'Erro ao fazer login');
    },
  });
}

/**
 * Hook para registro
 */
export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterBody) => usuarioService.register(data),
    onSuccess: () => {
      toast.success('Usuário registrado com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro no registro:', error);
      toast.error(error.message || 'Erro ao registrar usuário');
    },
  });
}

/**
 * Hook para logout
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => usuarioService.logout(),
    onSuccess: () => {
      queryClient.clear();
      toast.success('Logout realizado com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro no logout:', error);
      toast.error(error.message || 'Erro ao fazer logout');
    },
  });
}

/**
 * Hook para alterar senha
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordBody) => usuarioService.changePassword(data),
    onSuccess: () => {
      toast.success('Senha alterada com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao alterar senha:', error);
      toast.error(error.message || 'Erro ao alterar senha');
    },
  });
}