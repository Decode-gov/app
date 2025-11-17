/**
 * Tipos para as requisições e respostas da API
 * Body types derivados dos schemas Zod (única fonte de verdade)
 * Response types mantidos como interfaces
 */

import type {
  // Necessidades de Informação
  CreateNecessidadeInformacaoFormData,
  UpdateNecessidadeInformacaoFormData,
  // Políticas Internas
  CreatePoliticaInternaFormData,
  UpdatePoliticaInternaFormData,
  // Papéis
  CreatePapelFormData,
  UpdatePapelFormData,
  // Comunidades
  CreateComunidadeFormData,
  UpdateComunidadeFormData,
  // Atribuições
  CreateAtribuicaoFormData,
  UpdateAtribuicaoFormData,
  // Definições
  CreateDefinicaoFormData,
  UpdateDefinicaoFormData,
  // Listas de Classificação
  CreateListaClassificacaoFormData,
  UpdateListaClassificacaoFormData,
  // Classificações de Informação
  CreateClassificacaoInformacaoFormData,
  UpdateClassificacaoInformacaoFormData,
  // Sistemas
  CreateSistemaFormData,
  UpdateSistemaFormData,
  // Bancos
  CreateBancoFormData,
  UpdateBancoFormData,
  // Tabelas
  CreateTabelaFormData,
  UpdateTabelaFormData,
  // Colunas
  CreateColunaFormData,
  UpdateColunaFormData,
  // Tipos de Dados
  CreateTipoDadosFormData,
  UpdateTipoDadosFormData,
  // Listas de Referência
  CreateListaReferenciaFormData,
  UpdateListaReferenciaFormData,
  // Documentos
  CreateDocumentoFormData,
  UpdateDocumentoFormData,
  // Dimensões de Qualidade
  CreateDimensaoQualidadeFormData,
  UpdateDimensaoQualidadeFormData,
  // Regras de Negócio
  CreateRegraNegocioFormData,
  UpdateRegraNegocioFormData,
  // Regras de Qualidade
  CreateRegraQualidadeFormData,
  UpdateRegraQualidadeFormData,
  // Partes Envolvidas
  CreateParteEnvolvidaFormData,
  UpdateParteEnvolvidaFormData,
  // Regulação
  CreateRegulacaoFormData,
  UpdateRegulacaoFormData,
  // Criticidade Regulatória
  CreateCriticidadeRegulatoriaFormData,
  UpdateCriticidadeRegulatoriaFormData,
  // KPIs
  CreateKPIFormData,
  UpdateKPIFormData,
  // Processos
  CreateProcessoFormData,
  UpdateProcessoFormData,
  // Produtos de Dados
  CreateProdutoDadosFormData,
  UpdateProdutoDadosFormData,
  // Atividades
  CreateAtividadeFormData,
  UpdateAtividadeFormData,
  // Operações
  CreateOperacaoFormData,
  UpdateOperacaoFormData,
  // Usuários
  CreateUsuarioFormData,
  UpdateUsuarioFormData,
  LoginFormData,
  ChangePasswordFormData,
  // Repositórios de Documento
  CreateRepositorioDocumentoFormData,
  UpdateRepositorioDocumentoFormData,
  // MFA
  MfaFormData,
  MfaVerifyFormData,
} from '@/schemas';

// ============================================================================
// TIPOS PARA USUÁRIOS
// ============================================================================
export type CreateUsuarioBody = CreateUsuarioFormData
export type UpdateUsuarioBody = UpdateUsuarioFormData

export interface UsuarioResponse {
  id: string;
  nome: string;
  email: string;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// TIPOS PARA COLUNAS
// ============================================================================
export type CreateColunaBody = CreateColunaFormData
export type UpdateColunaBody = UpdateColunaFormData

export interface ColunaResponse {
  id: string;
  nome: string;
  descricao?: string | null;
  tabelaId: string;
  termoId?: string | null;
  necessidadeInformacaoId?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  tabela?: TabelaResponse;
  necessidadeInformacao?: NecessidadeInformacaoResponse;
  termo?: DefinicaoResponse;
}

// ============================================================================
// TIPOS PARA KPIS
// ============================================================================
export type KpiBody = CreateKPIFormData
export type UpdateKpiBody = UpdateKPIFormData

export interface KpiResponse {
  id: string;
  nome: string;
  comunidadeId?: string;
  processoId?: string;
  comunidade?: {
    id: string;
    nome: string;
    parentId?: string;
  };
  processo?: {
    id: string;
    nome: string;
    descricao?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// TIPOS PARA PROCESSOS
// ============================================================================
export type ProcessoBody = CreateProcessoFormData
export type UpdateProcessoBody = UpdateProcessoFormData

export interface ProcessoResponse {
  id: string;
  nome: string;
  descricao?: string;
  comunidadeId: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// TIPOS PARA DEFINIÇÕES (TERMOS)
// ============================================================================
export type DefinicaoBody = CreateDefinicaoFormData
export type UpdateDefinicaoBody = UpdateDefinicaoFormData

export interface DefinicaoResponse {
  id: string;
  termo: string;
  definicao: string;
  sigla?: string;
  comunidadeId: string;
  comunidade: {
    id: string;
    nome: string;
    parentId?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// TIPOS PARA PAPÉIS DE GOVERNANÇA
// ============================================================================
export type PapelBody = CreatePapelFormData
export type UpdatePapelBody = UpdatePapelFormData

export interface PapelResponse {
  id: string;
  listaPapelId: string;
  comunidadeId: string;
  nome: string;
  descricao?: string;
  politicaId: string;
  documentoAtribuicao?: string;
  comiteAprovadorId?: string;
  onboarding: boolean;
  politica?: {
    id: string;
    nome: string;
    descricao?: string;
  };
  comunidade?: {
    id: string;
    nome: string;
    parentId?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// TIPOS PARA NECESSIDADES DE INFORMAÇÃO
// ============================================================================
export type NecessidadeInformacaoBody = CreateNecessidadeInformacaoFormData
export type UpdateNecessidadeInformacaoBody = UpdateNecessidadeInformacaoFormData

export interface NecessidadeInformacaoResponse {
  id: string;
  questaoGerencial: string;
  elementoEstrategico?: string;
  elementoTatico?: string;
  origemQuestao: string;
  createdAt: Date;
  updatedAt: Date | null;
}

// ============================================================================
// TIPOS PARA REGRAS DE NEGÓCIO
// ============================================================================
export type RegraNegocioBody = CreateRegraNegocioFormData
export type UpdateRegraNegocioBody = UpdateRegraNegocioFormData

export interface RegraNegocioResponse {
  id: string;
  descricao: string;
  politicaId: string;
  sistemaId?: string | null;
  responsavelId: string;
  termoId: string;
  politica?: {
    id: string;
    nome?: string;
    versao: string;
  };
  sistema?: {
    id: string;
    nome: string;
    descricao?: string | null;
  } | null;
  responsavel?: {
    id: string;
    nome: string;
    descricao?: string | null;
  };
  termo?: {
    id: string;
    termo: string;
    definicao: string;
  };
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// TIPOS PARA COMUNIDADES (DOMÍNIOS)
// ============================================================================
export type ComunidadeBody = CreateComunidadeFormData
export type UpdateComunidadeBody = UpdateComunidadeFormData

export interface ComunidadeResponse {
  id: string;
  nome: string;
  parentId?: string;
  parent?: ComunidadeResponse;
  children?: ComunidadeResponse[];
}

// ============================================================================
// TIPOS PARA TABELAS
// ============================================================================
export type TabelaBody = CreateTabelaFormData
export type UpdateTabelaBody = UpdateTabelaFormData

export interface TabelaResponse {
  id: string;
  nome: string;
  bancoId?: string | null;
  termoId?: string | null;
  necessidadeInformacaoId?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  banco?: {
    id: string;
    nome: string;
    sistemaId?: string | null;
  } | null;
  termo?: {
    id: string;
    termo: string;
    definicao: string;
  } | null;
  colunas?: Array<{
    id: string;
    nome: string;
    descricao?: string | null;
    obrigatorio: boolean;
    unicidade: boolean;
  }>;
  regrasQualidade?: Array<{
    id: string;
    nome: string;
    descricao?: string | null;
  }>;
  _count?: {
    colunas: number;
    codificacoes: number;
  };
}

// ============================================================================
// TIPOS PARA SISTEMAS (ATIVOS TECNOLÓGICOS)
// ============================================================================
export type SistemaBody = CreateSistemaFormData
export type UpdateSistemaBody = UpdateSistemaFormData

export interface SistemaResponse {
  id: string;
  nome: string;
  descricao: string | null;
  repositorio: string;
  createdAt?: string | null;
  updatedAt?: string | null;
  bancos?: Array<{
    id: string;
    nome: string;
    tabelas?: Array<{
      id: string;
      nome: string;
    }>;
  }>;
}

// ============================================================================
// TIPOS PARA BANCOS DE DADOS
// ============================================================================
export type BancoBody = CreateBancoFormData
export type UpdateBancoBody = UpdateBancoFormData

export interface BancoResponse {
  id: string;
  nome: string;
  sistemaId?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  sistema?: {
    id: string;
    nome: string;
    descricao?: string | null;
    repositorio: string;
  } | null;
  tabelas?: Array<{
    id: string;
    nome: string;
  }>;
  _count?: {
    tabelas: number;
  };
}

// ============================================================================
// TIPOS PARA POLÍTICAS INTERNAS
// ============================================================================
export type PoliticaInternaBody = CreatePoliticaInternaFormData
export type UpdatePoliticaInternaBody = UpdatePoliticaInternaFormData

export interface PoliticaInternaResponse {
  id: string;
  nome: string;
  descricao: string;
  categoria: string;
  objetivo: string;
  escopo: string;
  dominioDadosId?: string;
  responsavel: string;
  dataCriacao: Date;
  dataInicioVigencia: Date;
  dataTermino?: Date;
  status: 'Em_elaboracao' | 'Vigente' | 'Revogada';
  versao: string;
  anexosUrl?: string;
  relacionamento?: string;
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// TIPOS PARA TIPOS DE DADOS
// ============================================================================
export type TipoDadosBody = CreateTipoDadosFormData
export type UpdateTipoDadosBody = UpdateTipoDadosFormData

export interface TipoDadosResponse {
  id: string;
  nome: string;
  descricao?: string;
  categoria?: 'PRIMITIVO' | 'COMPLEXO' | 'ESTRUTURADO' | 'SEMI_ESTRUTURADO' | 'NAO_ESTRUTURADO';
  permiteNulo?: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// TIPOS PARA CLASSIFICAÇÕES DE INFORMAÇÃO
// ============================================================================
export type CreateClassificacaoBody = CreateClassificacaoInformacaoFormData
export type UpdateClassificacaoBody = UpdateClassificacaoInformacaoFormData

export interface ClassificacaoInformacaoResponse {
  id: string;
  classificacaoId: string;
  termoId: string;
  classificacao?: ListaClassificacaoResponse;
  termo?: DefinicaoResponse;
  createdAt: string;
  updatedAt: string;
}

// Alias para manter compatibilidade
export type ClassificacaoResponse = ClassificacaoInformacaoResponse

// ============================================================================
// TIPOS PARA PRODUTOS DE DADOS
// ============================================================================
export type ProdutoDadosBody = CreateProdutoDadosFormData
export type UpdateProdutoDadosBody = UpdateProdutoDadosFormData

export interface ProdutoDadosResponse {
  id: string;
  nome: string;
  descricao: string;
  termos?: string[];
  ativos?: string[];
  regrasNegocio?: string[];
  regrasQualidade?: string[];
  regulacaoId?: string;
  politicaId?: string;
  dominioId?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// TIPOS PARA REFERENCIAL DE CLASSIFICAÇÃO
// ============================================================================
export type ListaClassificacaoBody = CreateListaClassificacaoFormData
export type UpdateListaClassificacaoBody = UpdateListaClassificacaoFormData

export interface ListaClassificacaoResponse {
  id: string;
  classificacao: string;
  descricao: string;
  politicaId: string;
  politica: PoliticaInternaResponse
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// TIPOS PARA ATRIBUIÇÕES (PAPEL-DOMÍNIO)
// ============================================================================
export type AtribuicaoBody = CreateAtribuicaoFormData
export type UpdateAtribuicaoBody = UpdateAtribuicaoFormData

export interface ComiteAprovador {
  id: string;
  nome: string;
}

// Alias para response API
export type ComiteAprovadorResponse = ComiteAprovador

export type CreateComiteAprovadorData = {
  nome: string;
}

export type UpdateComiteAprovadorData = CreateComiteAprovadorData

export interface AtribuicaoResponse {
  id: string;
  papelId: string;
  dominioId: string;
  documentoAtribuicao: string;
  comiteAprovadorId: string;
  onboarding: boolean;
  responsavel: string;
  papel: {
    id: string;
    nome: string;
    descricao?: string;
  };
  dominio: {
    id: string;
    nome: string;
    descricao?: string;
  };
  comiteAprovador?: ComiteAprovador;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// TIPOS PARA DOCUMENTOS (POLIMÓRFICO)
// ============================================================================
export type DocumentoBody = CreateDocumentoFormData
export type UpdateDocumentoBody = UpdateDocumentoFormData

export interface DocumentoResponse {
  id: string;
  entidadeId: string;
  tipoEntidade: 'Politica' | 'Papel' | 'Atribuicao' | 'Processo' | 'Termo' | 'KPI' | 'RegraNegocio' | 'RegraQualidade' | 'Dominio' | 'Sistema' | 'Tabela' | 'Coluna';
  nomeArquivo: string;
  tamanhoBytes: number;
  tipoArquivo: string;
  caminhoArquivo: string;
  descricao?: string;
  metadados?: string;
  checksum?: string;
  versao: number;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// TIPOS GENÉRICOS PARA RESPOSTAS DA API
// ============================================================================
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  [key: string]: string | number | boolean | undefined;
}

// ============================================================================
// TIPOS PARA AUDITORIA
// ============================================================================
export interface AuditoriaBody {
  usuario: string;
  endpoint: string;
  metodo: string;
  status: number;
  dataHora: string;
}

export interface AuditoriaResponse {
  id: string;
  usuario: string;
  endpoint: string;
  metodo: string;
  status: number;
  dataHora: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// TIPOS PARA LISTAS DE REFERÊNCIA
// ============================================================================
export type ListaReferenciaBody = CreateListaReferenciaFormData
export type UpdateListaReferenciaBody = UpdateListaReferenciaFormData

export interface ListaReferenciaResponse {
  id: string;
  nome: string;
  descricao?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// TIPOS PARA DIMENSÕES DE QUALIDADE
// ============================================================================
export type DimensaoQualidadeBody = CreateDimensaoQualidadeFormData
export type UpdateDimensaoQualidadeBody = UpdateDimensaoQualidadeFormData

export interface DimensaoQualidadeResponse {
  id: string;
  nome: string;
  descricao: string;
  politicaId: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// TIPOS PARA REGRAS DE QUALIDADE
// ============================================================================
export type RegraQualidadeBody = CreateRegraQualidadeFormData
export type UpdateRegraQualidadeBody = UpdateRegraQualidadeFormData

export interface RegraQualidadeResponse {
  id: string;
  descricao: string;
  regraNegocioId?: string | null;
  dimensaoId: string;
  tabelaId: string;
  colunaId: string;
  responsavelId: string;
  createdAt?: string;
  updatedAt?: string;
  regraNegocio?: {
    id: string;
    descricao: string;
    processoId: string;
  } | null;
  dimensao?: {
    id: string;
    nome: string;
    descricao: string;
  };
  tabela?: {
    id: string;
    nome: string;
  };
  coluna?: {
    id: string;
    nome: string;
    descricao?: string | null;
  };
  responsavel?: {
    id: string;
    nome: string;
    descricao?: string | null;
  };
}

// ============================================================================
// TIPOS PARA PARTES ENVOLVIDAS
// ============================================================================
export type ParteEnvolvidaBody = CreateParteEnvolvidaFormData
export type UpdateParteEnvolvidaBody = UpdateParteEnvolvidaFormData

export interface ParteEnvolvidaResponse {
  id: string;
  nome: string;
  tipo: 'PESSOA_FISICA' | 'PESSOA_JURIDICA' | 'ORGAO_PUBLICO' | 'ENTIDADE_EXTERNA';
  contato?: string;
  papelId?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// TIPOS PARA REGULAÇÃO
// ============================================================================
export type RegulacaoBody = CreateRegulacaoFormData
export type UpdateRegulacaoBody = UpdateRegulacaoFormData

export interface RegulacaoResponse {
  id: string;
  nome: string;
  epigrafe: string;
  descricao: string;
  orgaoRegulador?: string;
  vigencia?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// TIPOS PARA CRITICIDADE REGULATÓRIA
// ============================================================================
export type CriticidadeRegulatoriaBody = CreateCriticidadeRegulatoriaFormData
export type UpdateCriticidadeRegulatoriaBody = UpdateCriticidadeRegulatoriaFormData

export interface CriticidadeRegulatoriaResponse {
  id: string;
  regulacaoId: string;
  regraQualidadeId: string;
  grauCriticidade: 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';
  regulacao?: RegulacaoResponse;
  regraQualidade?: RegraQualidadeResponse;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// TIPOS PARA ATIVIDADES
// ============================================================================
export type AtividadeBody = CreateAtividadeFormData
export type UpdateAtividadeBody = UpdateAtividadeFormData

export interface AtividadeResponse {
  id: string;
  nome: string;
  descricao: string;
  status: 'PLANEJADA' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'CANCELADA' | 'PAUSADA';
  prioridade: 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';
  processoId: string;
  responsavel?: string;
  dataInicio?: string;
  dataFim?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// TIPOS PARA OPERAÇÕES
// ============================================================================
export type OperacaoBody = CreateOperacaoFormData
export type UpdateOperacaoBody = UpdateOperacaoFormData

export interface OperacaoResponse {
  id: string;
  nome: string;
  tipo: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'PROCESS' | 'VALIDATE' | 'TRANSFORM';
  frequencia: 'UNICA' | 'DIARIA' | 'SEMANAL' | 'MENSAL' | 'TRIMESTRAL' | 'ANUAL' | 'EVENTUAL';
  complexidade: 'BAIXA' | 'MEDIA' | 'ALTA';
  atividadeId: string;
  automatizada?: boolean;
  critica?: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// TIPOS PARA DASHBOARD
// ============================================================================
export interface DashboardMetricas {
  totalEntidades: number;
  totalUsuarios: number;
  totalPoliticas: number;
  totalTermos: number;
  totalKpis: number;
  totalProcessos: number;
  totalSistemas: number;
  totalTabelas: number;
  totalColunas: number;
  totalDocumentos: number;
}

export interface DashboardUsuario {
  usuario: UsuarioResponse;
  ultimaAtividade: string;
  entidadesCriadas: number;
  entidadesAtualizadas: number;
}

export interface DashboardQualidade {
  regrasQualidade: number;
  dimensoesQualidade: number;
  classificacoesCompletas: number;
  termosDefinidos: number;
  documentacaoAtualizada: number;
}

// ============================================================================
// TIPOS PARA IMPORTAÇÃO/EXPORTAÇÃO
// ============================================================================
export interface ImportacaoExportacaoBody {
  formato: 'EXCEL' | 'CSV' | 'JSON';
  entidades: string[];
  filtros?: Record<string, string | number | boolean>;
  opcoes?: Record<string, string | number | boolean>;
}

export interface ImportacaoExportacaoResponse {
  id: string;
  formato: 'EXCEL' | 'CSV' | 'JSON';
  entidades: string[];
  status: 'PENDENTE' | 'PROCESSANDO' | 'CONCLUIDO' | 'ERRO';
  arquivo?: string;
  erro?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// TIPOS PARA AUTENTICAÇÃO
// ============================================================================
export type LoginBody = LoginFormData

export interface LoginResponse {
  token: string;
  usuario: UsuarioResponse;
  expiresIn: number;
  requiresMfa?: boolean;
}

export type ChangePasswordBody = ChangePasswordFormData

export interface ChangePasswordResponse {
  message: string;
  success: boolean;
}

// ============================================================================
// TIPOS PARA MFA
// ============================================================================
export type MfaBody = MfaFormData
export type MfaVerifyBody = MfaVerifyFormData

export interface MfaResponse {
  id: string;
  usuarioId: string;
  tipo: 'TOTP' | 'SMS' | 'EMAIL';
  status: 'ATIVO' | 'INATIVO';
  configuracao?: Record<string, string | number | boolean>;
  backup_codes?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface MfaSetupResponse {
  qrCode?: string;
  secret?: string;
  backupCodes: string[];
}

// ============================================================================
// TIPOS PARA REPOSITÓRIOS DE DOCUMENTOS
// ============================================================================
export type RepositorioDocumentoBody = CreateRepositorioDocumentoFormData
export type UpdateRepositorioDocumentoBody = UpdateRepositorioDocumentoFormData

export interface RepositorioDocumentoResponse {
  id: string;
  nome: string;
  tipo: string;
  localizacao: string;
  responsavel: string;
  descricao?: string;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentoRepositorioResponse {
  id: string;
  termoId: string;
  repositorioId: string;
  termo?: {
    id: string;
    termo: string;
    definicao?: string;
    sigla?: string;
  };
  repositorio?: RepositorioDocumentoResponse;
  createdAt: string;
  updatedAt: string;
}

export interface UploadDocumentoBody {
  arquivo: File;
  nome?: string;
  descricao?: string;
  pasta?: string;
}

export interface UploadDocumentoResponse {
  id: string;
  nome: string;
  url: string;
  tamanho: number;
  tipo: string;
  repositorioId: string;
}

// ============================================================================
// TIPOS PARA TRATAMENTO DE ERROS
// ============================================================================
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}