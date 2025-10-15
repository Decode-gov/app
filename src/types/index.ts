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
  status: 'PENDENTE' | 'EM_ANDAMENTO' | 'ATENDIDA' | 'CANCELADA'
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

// Novas entidades para as 20 funcionalidades
export interface AtribuicaoPapelDominio {
  id: string
  dominioId: string
  papelId: string
  documentoAtribuicao: string
  comiteAprovador: string
  onboarding: boolean
  createdAt: string
  updatedAt: string
}

export interface TermoNegocio {
  id: string
  termo: string
  definicao: string
  exemploUso?: string
  sinonimos?: string
  fonteOrigem?: string
  createdAt: string
  updatedAt: string
}

export interface ReferencialClassificacao {
  id: string
  categoria: string
  descricao: string
  politicaId: string
  createdAt: string
  updatedAt: string
}

export interface AtivoTecnologico {
  id: string
  sistema: string
  bancoDados?: string
  repositorio?: string
  tecnologia?: string
  responsavelTecnico?: string
  createdAt: string
  updatedAt: string
}

export interface ListaReferencia {
  id: string
  nome: string
  descricao: string
  termoId: string
  tabelaId?: string
  colunaId?: string
  createdAt: string
  updatedAt: string
}

export interface Documento {
  id: string
  titulo: string
  descricao: string
  url: string
  entidadeTipo: "termo" | "politica" | "processo" | "sistema" | "kpi" | "regulacao"
  entidadeId: string
  createdAt: string
  updatedAt: string
}

export interface DimensaoQualidade {
  id: string
  nome: string
  descricao: string
  politicaId: string
  createdAt: string
  updatedAt: string
}

export interface RegraQualidade {
  id: string
  dimensaoId: string
  descricao: string
  tabelaId?: string
  colunaId?: string
  responsavelId?: string
  createdAt: string
  updatedAt: string
}

export interface ParteEnvolvida {
  id: string
  nome: string
  tipo: "interno" | "externo" | "fornecedor" | "cliente" | "parceiro"
  contato?: string
  papelId?: string
  createdAt: string
  updatedAt: string
}

export interface Regulacao {
  id: string
  nome: string
  epigrafe: string
  descricao: string
  orgaoRegulador?: string
  vigencia?: string
  createdAt: string
  updatedAt: string
}

export interface CriticidadeRegulatoria {
  id: string
  regulacaoId: string
  epigrafe: string
  criticidade: "baixa" | "media" | "alta" | "critica"
  justificativa?: string
  createdAt: string
  updatedAt: string
}

export interface ProdutoDados {
  id: string
  nome: string
  descricao: string
  termos?: string[]
  ativos?: string[]
  regrasNegocio?: string[]
  regrasQualidade?: string[]
  regulacaoId?: string
  politicaId?: string
  dominioId?: string
  createdAt: string
  updatedAt: string
}

// Tipos para formulários
export type CriarUsuario = Omit<Usuario, "id" | "createdAt" | "updatedAt">
export type AtualizarUsuario = Partial<CriarUsuario>

export type CriarKPI = Omit<KPI, "id" | "createdAt" | "updatedAt">
export type AtualizarKPI = Partial<CriarKPI>

export type CriarPoliticaInterna = Omit<PoliticaInterna, "createdAt" | "updatedAt">
export type AtualizarPoliticaInterna = Partial<CriarPoliticaInterna>

// Novos tipos para formulários
export type CriarAtribuicaoPapelDominio = Omit<AtribuicaoPapelDominio, "id" | "createdAt" | "updatedAt">
export type CriarTermoNegocio = Omit<TermoNegocio, "id" | "createdAt" | "updatedAt">
export type CriarReferencialClassificacao = Omit<ReferencialClassificacao, "id" | "createdAt" | "updatedAt">
export type CriarAtivoTecnologico = Omit<AtivoTecnologico, "id" | "createdAt" | "updatedAt">
export type CriarListaReferencia = Omit<ListaReferencia, "id" | "createdAt" | "updatedAt">
export type CriarDocumento = Omit<Documento, "id" | "createdAt" | "updatedAt">
export type CriarDimensaoQualidade = Omit<DimensaoQualidade, "id" | "createdAt" | "updatedAt">
export type CriarRegraQualidade = Omit<RegraQualidade, "id" | "createdAt" | "updatedAt">
export type CriarParteEnvolvida = Omit<ParteEnvolvida, "id" | "createdAt" | "updatedAt">
export type CriarRegulacao = Omit<Regulacao, "id" | "createdAt" | "updatedAt">
export type CriarCriticidadeRegulatoria = Omit<CriticidadeRegulatoria, "id" | "createdAt" | "updatedAt">
export type CriarProdutoDados = Omit<ProdutoDados, "id" | "createdAt" | "updatedAt">

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
