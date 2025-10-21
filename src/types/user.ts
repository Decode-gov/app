import z from "zod"

// Schema unificado para formulário
export const usuarioFormSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  email: z.email("Email deve ser válido"),
  senha: z.string().optional(),
  status: z.enum(["ativo", "inativo"]),
})

// Schema para criação (senha obrigatória)
export const usuarioSchema = usuarioFormSchema.extend({
  senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
})

// Schema para edição (senha opcional)
export const editUsuarioSchema = usuarioFormSchema.extend({
  senha: z.string().optional().refine((val) => !val || val.length >= 6, {
    message: "Se informada, senha deve ter pelo menos 6 caracteres",
  }),
})

export type UsuarioFormData = z.infer<typeof usuarioFormSchema>
export type EditUsuarioFormData = z.infer<typeof editUsuarioSchema>

// Tipo do usuário (response da API)
export type Usuario = {
  id: string
  nome: string
  email: string
  ativo: boolean
  createdAt: string
}

// Estatísticas dos usuários
export type UsuarioStats = {
  total: number
  ativos: number
  inativos: number
}
