import { z } from "zod"

export const UsuarioSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  status: z.enum(["ativo", "inativo"]),
  papeis: z.array(z.string()).min(1, "Selecione pelo menos um papel"),
})

export const PapelSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  descricao: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  politicaId: z.string().min(1, "Política é obrigatória"),
})

export const DefinicaoSchema = z.object({
  definicao: z.string().min(10, "Definição deve ter pelo menos 10 caracteres"),
  categoria: z.enum(["Dado bruto", "Dado processado", "Dado interpretado", "Produto"]),
  sigla: z.string().optional(),
})

export const ComunidadeSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  superiorId: z.string().optional(),
})

export const ProcessoSchema = z.object({
  processo: z.string().min(2, "Nome do processo deve ter pelo menos 2 caracteres"),
  descricao: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
})

export const SistemaSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  descricao: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
})

export const BancoSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  descricao: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
})

export const KPISchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  objetivoDescricao: z.string().min(10, "Objetivo/Descrição deve ter pelo menos 10 caracteres"),
  calculo: z.string().min(10, "Cálculo deve ter pelo menos 10 caracteres"),
  periodicidade: z.enum(["diário", "semanal", "quinzenal", "mensal", "trimestral", "semestral", "anual"]),
  dominioId: z.string().optional(),
  processoId: z.string().optional(),
  sistemaId: z.string().optional(),
  areaGerenciamento: z.string().min(1, "Área de gerenciamento é obrigatória"),
  responsavelId: z.string().min(1, "Responsável é obrigatório"),
  regraNegocioId: z.string().optional(),
  regraQualidadeId: z.string().optional(),
  observacao: z.string().optional(),
})

export const PoliticaInternaSchema = z.object({
  id: z.number().optional(),
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  descricao: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  categoria: z.string().min(2, "Categoria deve ter pelo menos 2 caracteres"),
  objetivo: z.string().min(10, "Objetivo deve ter pelo menos 10 caracteres"),
  escopo: z.string().min(10, "Escopo deve ter pelo menos 10 caracteres"),
  dominioId: z.string().optional(),
  responsavel: z.string().min(2, "Responsável deve ter pelo menos 2 caracteres"),
  dataCriacao: z.string().min(1, "Data de criação é obrigatória"),
  dataVigenciaInicio: z.string().min(1, "Data de vigência é obrigatória"),
  dataTermino: z.string().optional(),
  status: z.enum(["Em elaboração", "Vigente", "Revogada"]),
  versao: z.string().min(1, "Versão é obrigatória"),
  anexosUrl: z.string().url("URL inválida").optional().or(z.literal("")),
  relacionadas: z.string().optional(),
  observacoes: z.string().optional(),
})

export const RegraNegocioSchema = z.object({
  termoId: z.string().min(1, "Termo é obrigatório"),
  politicaId: z.string().min(1, "Política é obrigatória"),
  sistemaId: z.string().optional(),
  regra: z.string().min(10, "Regra deve ter pelo menos 10 caracteres"),
  responsavelId: z.string().min(1, "Responsável é obrigatório"),
})

export const NecessidadeInformacaoSchema = z.object({
  questaoGerencial: z.string().min(10, "Questão gerencial deve ter pelo menos 10 caracteres"),
  elementoEstrategico: z.string().optional(),
  elementoTatico: z.string().optional(),
  origemDaQuestao: z.string().min(10, "Origem da questão deve ter pelo menos 10 caracteres"),
})

export const TabelaSchema = z.object({
  termoId: z.string().min(1, "Termo é obrigatório"),
  sistemaId: z.string().min(1, "Sistema é obrigatório"),
  bancoId: z.string().min(1, "Base de dados é obrigatória"),
  tabela: z.string().min(2, "Nome da tabela deve ter pelo menos 2 caracteres"),
  coluna: z.string().min(2, "Nome da coluna deve ter pelo menos 2 caracteres"),
  questaoGerencialId: z.string().min(1, "Questão gerencial é obrigatória"),
})

export const ColunaSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  descricao: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  tabelaId: z.string().min(1, "Tabela relacionada é obrigatória"),
})

export const TipoDadoSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  descricao: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  exemplo: z.string().optional(),
})

export const ClassificacaoCategoriaSchema = z.object({
  classificacao: z.string().min(2, "Classificação deve ter pelo menos 2 caracteres"),
  politicaSegurancaId: z.string().min(1, "Política de segurança é obrigatória"),
  descricao: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
})

export const ClassificacaoTermoSchema = z.object({
  termoId: z.string().min(1, "Termo é obrigatório"),
  categoriaId: z.string().min(1, "Categoria é obrigatória"),
})

export const RepositorioDocumentoSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  relacionadoGED: z.boolean(),
  driveDeRede: z.boolean(),
})

// Schemas para filtros
export const KPIFiltrosSchema = z.object({
  periodicidade: z.string().optional(),
  dominioId: z.string().optional(),
  processoId: z.string().optional(),
  areaGerenciamento: z.string().optional(),
})

export const PoliticaInternaFiltrosSchema = z.object({
  status: z.string().optional(),
  categoria: z.string().optional(),
  dominioId: z.string().optional(),
})

export const AuditoriaFiltrosSchema = z.object({
  usuario: z.string().optional(),
  endpoint: z.string().optional(),
  metodo: z.string().optional(),
  status: z.string().optional(),
  dataInicial: z.string().optional(),
  dataFinal: z.string().optional(),
})

export type UsuarioFormData = z.infer<typeof UsuarioSchema>
export type PapelFormData = z.infer<typeof PapelSchema>
export type DefinicaoFormData = z.infer<typeof DefinicaoSchema>
export type ComunidadeFormData = z.infer<typeof ComunidadeSchema>
export type ProcessoFormData = z.infer<typeof ProcessoSchema>
export type SistemaFormData = z.infer<typeof SistemaSchema>
export type BancoFormData = z.infer<typeof BancoSchema>
export type KPIFormData = z.infer<typeof KPISchema>
export type PoliticaInternaFormData = z.infer<typeof PoliticaInternaSchema>
export type RegraNegocioFormData = z.infer<typeof RegraNegocioSchema>
export type NecessidadeInformacaoFormData = z.infer<typeof NecessidadeInformacaoSchema>
export type TabelaFormData = z.infer<typeof TabelaSchema>
export type ColunaFormData = z.infer<typeof ColunaSchema>
export type TipoDadoFormData = z.infer<typeof TipoDadoSchema>
export type ClassificacaoCategoriaFormData = z.infer<typeof ClassificacaoCategoriaSchema>
export type ClassificacaoTermoFormData = z.infer<typeof ClassificacaoTermoSchema>
export type RepositorioDocumentoFormData = z.infer<typeof RepositorioDocumentoSchema>
