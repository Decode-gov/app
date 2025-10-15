import { api } from "@/lib/api"
import { AtribuicaoPapelDominio, PaginatedResponse } from "@/types"
import { AtribuicaoPapelDominioFormData } from "@/schemas"

export const atribuicoesPapelDominioService = {
  list: async (page = 1, limit = 10, search = ""): Promise<PaginatedResponse<AtribuicaoPapelDominio>> => {
    const response = await api.get("/atribuicoes-papel-dominio", {
      params: { page, limit, search }
    })
    return response.data
  },

  getById: async (id: string): Promise<AtribuicaoPapelDominio> => {
    const response = await api.get(`/atribuicoes-papel-dominio/${id}`)
    return response.data
  },

  create: async (data: AtribuicaoPapelDominioFormData): Promise<AtribuicaoPapelDominio> => {
    const response = await api.post("/atribuicoes-papel-dominio", data)
    return response.data
  },

  update: async (id: string, data: Partial<AtribuicaoPapelDominioFormData>): Promise<AtribuicaoPapelDominio> => {
    const response = await api.put(`/atribuicoes-papel-dominio/${id}`, data)
    return response.data
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/atribuicoes-papel-dominio/${id}`)
  }
}