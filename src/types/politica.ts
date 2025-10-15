import { z } from "zod"

// Schema Zod para validação do formulário
export const politicaFormSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  descricao: z.string().optional(),
  categoria: z.string().min(1, "Categoria é obrigatória"),
  objetivo: z.string().min(1, "Objetivo é obrigatório"),
  escopo: z.string().min(1, "Escopo é obrigatório"),
  dominioDadosId: z.string().optional(),
  responsavel: z.string().min(1, "Responsável é obrigatório"),
  dataCriacao: z.date({ message: "Data de criação é obrigatória" }),
  dataInicioVigencia: z.date({ message: "Data de início de vigência é obrigatória" }),
  dataTermino: z.date().optional(),
  status: z.enum(["Em_elaboracao", "Vigente", "Revogada"], {
    message: "Status é obrigatório"
  }),
  versao: z.string().min(1, "Versão é obrigatória"),
  anexosUrl: z.string().optional(),
  relacionamento: z.string().optional(),
  observacoes: z.string().optional(),
})

export type PoliticaFormData = z.infer<typeof politicaFormSchema>

// Interface da Política
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
  status: "Em_elaboracao" | "Vigente" | "Revogada"
  versao: string
  anexosUrl: string | null
  relacionamento: string | null
  observacoes: string | null
}

// Estatísticas das Políticas
export interface PoliticaStats {
  total: number
  vigentes: number
  emElaboracao: number
  revogadas: number
  porCategoria: Record<string, number>
}