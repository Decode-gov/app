import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { Usuario, SelectOption, PaginatedResponse } from "@/types"
import { UsuarioFormData } from "@/schemas"
import { toast } from "sonner"
import { AxiosError } from "axios"

// Hooks para queries
export function useUsuarios(page = 1, limit = 10, search = "") {
  return useQuery({
    queryKey: ["usuarios", page, limit, search],
    queryFn: async (): Promise<PaginatedResponse<Usuario>> => {
      const response = await api.get("/usuarios", {
        params: { page, limit, search }
      })
      return response.data
    },
  })
}

export function useUsuario(id: string) {
  return useQuery({
    queryKey: ["usuario", id],
    queryFn: async (): Promise<Usuario> => {
      const response = await api.get(`/usuarios/${id}`)
      return response.data
    },
    enabled: !!id,
  })
}

export function useUsuariosSelect() {
  return useQuery({
    queryKey: ["usuarios-select"],
    queryFn: async (): Promise<SelectOption[]> => {
      const response = await api.get("/usuarios")
      return response.data.data.map((usuario: Usuario) => ({
        value: usuario.id,
        label: usuario.nome
      }))
    },
  })
}

// Hooks para mutations
export function useCreateUsuario() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UsuarioFormData): Promise<Usuario> => {
      const response = await api.post("/usuarios", data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] })
      queryClient.invalidateQueries({ queryKey: ["usuarios-select"] })
      toast.success("Usuário criado com sucesso!")
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data?.message || "Erro ao criar usuário")
    },
  })
}

export function useUpdateUsuario() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<UsuarioFormData> }): Promise<Usuario> => {
      const response = await api.put(`/usuarios/${id}`, data)
      return response.data
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] })
      queryClient.invalidateQueries({ queryKey: ["usuario", id] })
      queryClient.invalidateQueries({ queryKey: ["usuarios-select"] })
      toast.success("Usuário atualizado com sucesso!")
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data?.message || "Erro ao atualizar usuário")
    },
  })
}

export function useDeleteUsuario() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await api.delete(`/usuarios/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] })
      queryClient.invalidateQueries({ queryKey: ["usuarios-select"] })
      toast.success("Usuário excluído com sucesso!")
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data?.message || "Erro ao excluir usuário")
    },
  })
}
