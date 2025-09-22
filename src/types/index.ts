export interface Usuario {
  id: string
  nome: string
  email: string
  status: "ativo" | "inativo"
  papeis: string[]
  createdAt: string
  updatedAt: string
}

export interface Papel {
  id: string
  nome: string
  descricao: string
  politicaId: string
  createdAt: string
  updatedAt: string
}

export interface Definicao {
  id: string
  definicao: string
  categoria: "Dado bruto" | "Dado processado" | "Dado interpretado" | "Produto"
  sigla?: string
  createdAt: string
  updatedAt: string
}

export interface Comunidade {
  id: string
  nome: string
  superiorId?: string
  caminho?: string
  createdAt: string
  updatedAt: string
}

export interface Processo {
  id: string
  processo: string
  descricao: string
  createdAt: string
  updatedAt: string
}

export interface Sistema {
  id: string
  nome: string
  descricao: string
  createdAt: string
  updatedAt: string
}

export interface Banco {
  id: string
  nome: string
  descricao: string
  createdAt: string
  updatedAt: string
}

export interface KPI {
  id: string
  nome: string
  objetivoDescricao: string
  calculo: string
  periodicidade: "diário" | "semanal" | "quinzenal" | "mensal" | "trimestral" | "semestral" | "anual"
  dominioId?: string
  processoId?: string
  sistemaId?: string
  areaGerenciamento: string
  responsavelId: string
  regraNegocioId?: string
  regraQualidadeId?: string
  observacao?: string
  createdAt: string
  updatedAt: string
}

export interface PoliticaInterna {
  id: number
  nome: string
  descricao: string
  categoria: string
  objetivo: string
  escopo: string
  dominioId?: string
  responsavel: string
  dataCriacao: string
  dataVigenciaInicio: string
  dataTermino?: string
  status: "Em elaboração" | "Vigente" | "Revogada"
  versao: string
  anexosUrl?: string
  relacionadas?: string
  observacoes?: string
  createdAt: string
  updatedAt: string
}

export interface RegraNegocio {
  id: string
  termoId: string
  politicaId: string
  sistemaId?: string
  regra: string
  responsavelId: string
  createdAt: string
  updatedAt: string
}

export interface NecessidadeInformacao {
  id: string
  questaoGerencial: string
  elementoEstrategico?: string
  elementoTatico?: string
  origemDaQuestao: string
  createdAt: string
  updatedAt: string
}

export interface Tabela {
  id: string
  termoId: string
  sistemaId: string
  bancoId: string
  tabela: string
  coluna: string
  questaoGerencialId: string
  createdAt: string
  updatedAt: string
}

export interface Coluna {
  id: string
  nome: string
  descricao: string
  tabelaId: string
  createdAt: string
  updatedAt: string
}

export interface TipoDado {
  id: string
  nome: string
  descricao: string
  exemplo?: string
  createdAt: string
  updatedAt: string
}

export interface ClassificacaoCategoria {
  id: string
  classificacao: string
  politicaSegurancaId: string
  descricao: string
  createdAt: string
  updatedAt: string
}

export interface ClassificacaoTermo {
  id: string
  termoId: string
  categoriaId: string
  createdAt: string
  updatedAt: string
}

export interface RepositorioDocumento {
  id: string
  nome: string
  relacionadoGED: boolean
  driveDeRede: boolean
  createdAt: string
  updatedAt: string
}

export interface AuditoriaLog {
  id: string
  usuario: string
  endpoint: string
  metodo: string
  status: number
  dataHora: string
}

// Tipos para formulários
export type CriarUsuario = Omit<Usuario, "id" | "createdAt" | "updatedAt">
export type AtualizarUsuario = Partial<CriarUsuario>

export type CriarKPI = Omit<KPI, "id" | "createdAt" | "updatedAt">
export type AtualizarKPI = Partial<CriarKPI>

export type CriarPoliticaInterna = Omit<PoliticaInterna, "createdAt" | "updatedAt">
export type AtualizarPoliticaInterna = Partial<CriarPoliticaInterna>

// Tipos para respostas da API
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface SelectOption {
  value: string
  label: string
}
