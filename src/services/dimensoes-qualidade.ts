import { api } from '@/lib/api'
import { DimensaoQualidade } from '@/types'
import { DimensaoQualidadeFormData } from '@/schemas'

export interface DimensoesQualidadeResponse {
  data: DimensaoQualidade[]
  total: number
  page: number
  limit: number
}

class DimensoesQualidadeService {
  private endpoint = '/dimensoes-qualidade'

  async list(page: number = 1, limit: number = 10, search?: string): Promise<DimensoesQualidadeResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })

    if (search) {
      params.append('search', search)
    }

    const response = await api.get(`${this.endpoint}?${params}`)
    return response.data
  }

  async getById(id: string): Promise<DimensaoQualidade> {
    const response = await api.get(`${this.endpoint}/${id}`)
    return response.data
  }

  async create(data: DimensaoQualidadeFormData): Promise<DimensaoQualidade> {
    const response = await api.post(this.endpoint, data)
    return response.data
  }

  async update(id: string, data: DimensaoQualidadeFormData): Promise<DimensaoQualidade> {
    const response = await api.put(`${this.endpoint}/${id}`, data)
    return response.data
  }

  async remove(id: string): Promise<void> {
    await api.delete(`${this.endpoint}/${id}`)
  }
}

export const dimensoesQualidadeService = new DimensoesQualidadeService()