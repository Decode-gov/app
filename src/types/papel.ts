import { z } from "zod"

// Schema para validação do formulário
export const papelFormSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  politicaId: z.string().uuid('PoliticaId deve ser um UUID válido')
})

// Tipo inferido do schema
export type PapelFormData = z.infer<typeof papelFormSchema>

// Interface para o objeto Papel completo
export interface Papel {
  id: string
  nome: string
  descricao: string
  politicaId: string
  criadoEm: Date
  atualizadoEm: Date
}

// Tipo para estatísticas dos papéis
export interface PapelStats {
  total: number
  ativos: number
  inativos: number
  porPolitica: Record<string, number>
}