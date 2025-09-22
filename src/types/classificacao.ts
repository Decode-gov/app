import { z } from "zod"

// Schema de validação para formulário de classificação
export const classificacaoFormSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  descricao: z.string().optional(),
  politicaId: z.string().uuid('ID da política deve ser um UUID válido'),
  termoId: z.string().uuid('ID do termo deve ser um UUID válido').optional()
})

// Tipo derivado do schema para o formulário
export type ClassificacaoFormData = z.infer<typeof classificacaoFormSchema>

// Interface para classificação completa
export interface Classificacao {
  id: string
  nome: string
  descricao?: string
  politicaId: string
  termoId?: string
  criadoEm: Date
  atualizadoEm: Date
}

// Interface para política completa
export interface Politica {
  id: string
  nome: string
  descricao: string
  categoria: string
  objetivo: string
  escopo: string
  dominioDadosId: string | null
  responsavel: string
  dataCriacao: Date
  dataInicioVigencia: Date
  dataTermino: Date | null
  status: 'Em_elaboracao' | 'Vigente' | 'Revogada'
  versao: string
  anexosUrl: string | null
  relacionamento: string | null
  observacoes: string | null
}

// Interface para termo (para o select) - importando do módulo de termos
export interface TermoSelect {
  id: string
  nome: string
  descricao: string
  ativo: boolean
}

// Interface para estatísticas de classificações
export interface ClassificacaoStats {
  total: number
  ativos: number
  inativos: number
  porPolitica: Record<string, number>
}
