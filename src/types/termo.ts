import z from "zod"

// Schema para formulário de termo
export const termoFormSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  sigla: z.string().optional(),
  ativo: z.boolean(),
})

export type TermoFormData = z.infer<typeof termoFormSchema>

// Tipo do termo
export type Termo = {
  id: string
  nome: string
  descricao: string
  sigla?: string | null
  ativo: boolean
}

// Estatísticas dos termos
export type TermoStats = {
  total: number
  ativos: number
  inativos: number
}
