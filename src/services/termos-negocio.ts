import { api } from "@/lib/api"
import { TermoNegocio, PaginatedResponse, SelectOption } from "@/types"
import { TermoNegocioFormData } from "@/schemas"

export const termosNegocioService = {
  list: async (page = 1, limit = 10, search = ""): Promise<PaginatedResponse<TermoNegocio>> => {
    const response = await api.get("/termos-negocio", {
      params: { page, limit, search }
    })
    return response.data
  },

  getById: async (id: string): Promise<TermoNegocio> => {
    const response = await api.get(`/termos-negocio/${id}`)
    return response.data
  },

  create: async (data: TermoNegocioFormData): Promise<TermoNegocio> => {
    const response = await api.post("/termos-negocio", data)
    return response.data
  },

  update: async (id: string, data: Partial<TermoNegocioFormData>): Promise<TermoNegocio> => {
    const response = await api.put(`/termos-negocio/${id}`, data)
    return response.data
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/termos-negocio/${id}`)
  },

  getSelectOptions: async (): Promise<SelectOption[]> => {
    const response = await api.get("/termos-negocio")
    return response.data.data.map((item: TermoNegocio) => ({
      value: item.id,
      label: item.termo
    }))
  }
}