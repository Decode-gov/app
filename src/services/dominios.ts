import { api } from "@/lib/api"
import { Comunidade, PaginatedResponse, SelectOption } from "@/types"
import { ComunidadeFormData } from "@/schemas"

export const dominiosService = {
  list: async (page = 1, limit = 10, search = ""): Promise<PaginatedResponse<Comunidade>> => {
    const response = await api.get("/dominios", {
      params: { page, limit, search }
    })
    return response.data
  },

  getById: async (id: string): Promise<Comunidade> => {
    const response = await api.get(`/dominios/${id}`)
    return response.data
  },

  create: async (data: ComunidadeFormData): Promise<Comunidade> => {
    const response = await api.post("/dominios", data)
    return response.data
  },

  update: async (id: string, data: Partial<ComunidadeFormData>): Promise<Comunidade> => {
    const response = await api.put(`/dominios/${id}`, data)
    return response.data
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/dominios/${id}`)
  },

  getSelectOptions: async (): Promise<SelectOption[]> => {
    const response = await api.get("/dominios")
    return response.data.data.map((item: Comunidade) => ({
      value: item.id,
      label: item.nome
    }))
  }
}