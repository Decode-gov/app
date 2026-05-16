import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  useGetUsuariosPerfil,
  useGetUsuarios,
  useGetUsuariosId,
  postUsuariosRegister,
  postUsuariosLogin,
  postUsuariosLogout,
  putUsuariosId,
  deleteUsuariosId,
  postUsuariosAlterarSenha,
  getGetUsuariosQueryKey,
  getGetUsuariosIdQueryKey,
  getGetUsuariosPerfilQueryKey,
} from '@/api/generated/endpoints/usuarios/usuarios';
import type {
  GetUsuariosParams,
  PostUsuariosRegisterBody,
  PostUsuariosLoginBody,
  PutUsuariosIdBody,
  PostUsuariosAlterarSenhaBody,
} from '@/api/generated/model';

export const usuarioQueryKeys = {
  all: ['usuarios'] as const,
  lists: () => [...usuarioQueryKeys.all, 'list'] as const,
  list: (params?: GetUsuariosParams) => [...usuarioQueryKeys.lists(), { params }] as const,
  details: () => [...usuarioQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...usuarioQueryKeys.details(), id] as const,
  perfil: () => [...usuarioQueryKeys.all, 'perfil'] as const,
};

export function usePerfilUsuario() {
  return useGetUsuariosPerfil();
}

export function useUsuarios(params?: GetUsuariosParams) {
  return useGetUsuarios(params);
}

export function useUsuario(id: string, enabled = true) {
  return useGetUsuariosId(id, { query: { enabled: !!id && enabled } });
}

export function useCreateUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PostUsuariosRegisterBody) => postUsuariosRegister(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetUsuariosQueryKey() });
      toast.success('Usuário criado com sucesso!');
    },
    onError: () => toast.error('Erro ao criar usuário'),
  });
}

export function useUpdateUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PutUsuariosIdBody }) => putUsuariosId(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: getGetUsuariosQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetUsuariosIdQueryKey(id) });
      toast.success('Usuário atualizado com sucesso!');
    },
    onError: () => toast.error('Erro ao atualizar usuário'),
  });
}

export function useDeleteUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteUsuariosId(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: getGetUsuariosQueryKey() });
      queryClient.removeQueries({ queryKey: getGetUsuariosIdQueryKey(id) });
      toast.success('Usuário excluído com sucesso!');
    },
    onError: () => toast.error('Erro ao excluir usuário'),
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: (data: PostUsuariosLoginBody) => postUsuariosLogin(data),
    onSuccess: () => {
      toast.success('Login realizado com sucesso!');
    },
    onError: () => toast.error('Erro ao fazer login'),
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: PostUsuariosRegisterBody) => postUsuariosRegister(data),
    onSuccess: () => {
      toast.success('Usuário registrado com sucesso!');
    },
    onError: () => toast.error('Erro ao registrar usuário'),
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => postUsuariosLogout(),
    onSuccess: () => {
      queryClient.clear();
      toast.success('Logout realizado com sucesso!');
    },
    onError: () => toast.error('Erro ao fazer logout'),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: PostUsuariosAlterarSenhaBody) => postUsuariosAlterarSenha(data),
    onSuccess: () => {
      toast.success('Senha alterada com sucesso!');
    },
    onError: () => toast.error('Erro ao alterar senha'),
  });
}
