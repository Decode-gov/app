/**
 * Schemas Zod v4.1.5 para validaÃ§Ã£o de formulÃ¡rios
 * Baseado nas especificaÃ§Ãµes do prompt_nextjs.md
 * PadrÃ£o: Schema Base + Create + Update para cada entidade
 */

import { z } from "zod"

// ============================================================================
// HELPERS E VALIDAÃ‡Ã•ES COMUNS
// ============================================================================

const stringRequired = (min: number, campo: string) =>
  z.string().min(min, `${campo} deve ter pelo menos ${min} caracteres`)

const stringOptional = () => z.string().optional()

const uuidRequired = (campo: string) =>
  z.uuid().min(1, `${campo} é obrigatória`)


// ============================================================================
// 1) NECESSIDADE DE INFORMAÇÃO
// ============================================================================

export const NecessidadeInformacaoSchema = z.object({
  questaoGerencial: stringRequired(1, "Questão Gerencial"),
  elementoEstrategico: stringOptional(),
  elementoTatico: stringOptional(),
  origemQuestao: stringRequired(1, "Origem da Questão"),
})

export const CreateNecessidadeInformacaoSchema = NecessidadeInformacaoSchema
export const UpdateNecessidadeInformacaoSchema = NecessidadeInformacaoSchema.partial()

// ============================================================================
// 2) POLÍTICAS INTERNAS
// ============================================================================

export const PoliticaInternaSchema = z.object({
  nome: z.string().min(1).optional(),
  descricao: z.string().min(1).optional(),
  categoria: z.string().min(1).optional(),
  objetivo: z.string().min(1).optional(),
  escopo: z.string().min(1).optional(),
  dominioDadosId: z.uuid().nullable().optional(),
  responsavel: z.string().min(1).optional(),
  dataCriacao: z.coerce.date(),
  dataInicioVigencia: z.coerce.date(),
  dataTermino: z.coerce.date().nullable().optional(),
  status: z.enum(['Em_elaboracao', 'Vigente', 'Revogada']),
  versao: z.string().min(1),
  anexosUrl: z.url().nullable().optional(),
  relacionamento: z.string().nullable().optional(),
  observacoes: z.string().nullable().optional()
})

export const CreatePoliticaInternaSchema = PoliticaInternaSchema
export const UpdatePoliticaInternaSchema = PoliticaInternaSchema.partial()

// ============================================================================
// 3) PAPÉIS DE GOVERNANÇA
// ============================================================================

export const PapelSchema = z.object({
  listaPapelId: uuidRequired("Lista de Papel").optional(),
  nome: stringRequired(1, "Nome"),
  descricao: stringOptional(),
  politicaId: uuidRequired("Política")
})

export const CreatePapelSchema = PapelSchema
export const UpdatePapelSchema = PapelSchema.partial()

// ============================================================================
// 4) DOMÍNIOS / COMUNIDADES
// ============================================================================

export const ComunidadeSchema = z.object({
  nome: stringRequired(1, "Nome"),
  parentId: z.uuid().optional().nullable(),
})

export const CreateComunidadeSchema = ComunidadeSchema
export const UpdateComunidadeSchema = ComunidadeSchema

// ============================================================================
// 5) ATRIBUIÇÕES PAPEL↔DOMÍNIO
// ============================================================================

export const AtribuicaoSchema = z.object({
  papelId: stringRequired(1, "Papel"),
  dominioId: stringRequired(1, "Domínio"),
  documentoAtribuicao: stringRequired(1, "Documento de atribuição"),
  comiteAprovadorId: stringRequired(1, "Comitê aprovador"),
  onboarding: z.boolean().default(false),
  responsavel: stringRequired(1, "Responsável"),
})

export const CreateAtribuicaoSchema = AtribuicaoSchema
export const UpdateAtribuicaoSchema = z.object({
  papelId: stringOptional(),
  dominioId: stringOptional(),
  documentoAtribuicao: stringOptional(),
  comiteAprovadorId: stringOptional(),
  onboarding: z.boolean().optional(),
  responsavel: stringOptional(),
})

// ============================================================================
// 6) TERMOS DE NEGÓCIO (DEFINIÇÕES)
// ============================================================================

export const DefinicaoSchema = z.object({
  termo: stringRequired(1, "Termo"),
  definicao: stringRequired(1, "Definição"),
  sigla: stringOptional(),
})

export const CreateDefinicaoSchema = DefinicaoSchema
export const UpdateDefinicaoSchema = DefinicaoSchema.partial()

// ============================================================================
// 7) REFERENCIAL DE CLASSIFICAÇÃO (LISTAS DE CLASSIFICAÇÃO)
// ============================================================================

export const ListaClassificacaoSchema = z.object({
  classificacao: stringRequired(1, "Classificação da informação"),
  descricao: stringRequired(1, "Descrição"),
  politicaId: stringRequired(1, "Política"),
})

export const CreateListaClassificacaoSchema = ListaClassificacaoSchema
export const UpdateListaClassificacaoSchema = ListaClassificacaoSchema.partial()

// ============================================================================
// 8) CLASSIFICAÇÃO DAS INFORMAÇÕES
// ============================================================================

export const ClassificacaoInformacaoSchema = z.object({
  classificacaoId: uuidRequired("Lista de classificação"),
  termoId: uuidRequired("Termo"),
})

export const CreateClassificacaoInformacaoSchema = ClassificacaoInformacaoSchema
export const UpdateClassificacaoInformacaoSchema = ClassificacaoInformacaoSchema.partial()

// ============================================================================
// 9) ATIVOS TECNOLÓGICOS - SISTEMAS
// ============================================================================

export const SistemaSchema = z.object({
  nome: stringRequired(1, "Nome"),
  descricao: z.string().nullable().optional(),
  repositorio: stringOptional(),
})

export const CreateSistemaSchema = SistemaSchema
export const UpdateSistemaSchema = SistemaSchema.partial()

// ============================================================================
// 9) ATIVOS TECNOLÓGICOS - BANCOS DE DADOS
// ============================================================================

export const BancoSchema = z.object({
  nome: stringRequired(1, "Nome"),
  sistemaId: z.uuid().nullable().optional(),
})

export const CreateBancoSchema = BancoSchema
export const UpdateBancoSchema = BancoSchema.partial()

// ============================================================================
// 10) TABELAS
// ============================================================================

export const TabelaSchema = z.object({
  nome: stringRequired(1, "Nome"),
  bancoId: z.uuid().nullable().optional(),
})

export const CreateTabelaSchema = TabelaSchema
export const UpdateTabelaSchema = TabelaSchema.partial()

// ============================================================================
// 10) COLUNAS
// ============================================================================

export const ColunaSchema = z.object({
  nome: stringRequired(1, "Nome"),
  descricao: z.string().nullable().optional(),
  tabelaId: stringRequired(1, "Tabela"),
  politicaInternaId: z.uuid().nullable().optional(),
  termoId: z.uuid().nullable(),
  necessidadeInformacaoId: z.uuid().nullable(),
})

export const CreateColunaSchema = ColunaSchema
export const UpdateColunaSchema = ColunaSchema.partial()

// ============================================================================
// 10) TIPOS DE DADOS
// ============================================================================

export const TipoDadosSchema = z.object({
  nome: stringRequired(1, "Nome"),
  descricao: stringOptional(),
})

export const CreateTipoDadosSchema = TipoDadosSchema
export const UpdateTipoDadosSchema = TipoDadosSchema.partial()

// ============================================================================
// 11) LISTAS DE REFERÊNCIA (CÓDIGOS)
// ============================================================================

export const ListaReferenciaSchema = z.object({
  nome: stringRequired(1, "Nome"),
  descricao: stringOptional(),
})

export const CreateListaReferenciaSchema = ListaReferenciaSchema
export const UpdateListaReferenciaSchema = ListaReferenciaSchema.partial()

// ============================================================================
// 12) DOCUMENTOS (POLIMÓRFICO)
// ============================================================================

const TipoEntidadeEnum = z.enum([
  'Politica',
  'Papel',
  'Atribuicao',
  'Processo',
  'Termo',
  'KPI',
  'RegraNegocio',
  'RegraQualidade',
  'Dominio',
  'Sistema',
  'Tabela',
  'Coluna'
])

export const DocumentoSchema = z.object({
  entidadeId: uuidRequired("Entidade"),
  tipoEntidade: TipoEntidadeEnum,
  nomeArquivo: stringRequired(1, "Nome do Arquivo"),
  tamanhoBytes: z.number().int().positive("Tamanho deve ser positivo"),
  tipoArquivo: stringRequired(1, "Tipo de Arquivo"),
  caminhoArquivo: stringRequired(1, "Caminho do Arquivo"),
  descricao: stringOptional(),
  metadados: stringOptional(),
  checksum: stringOptional(),
  versao: z.number().int().positive().default(1),
  ativo: z.boolean().default(true),
})

export const CreateDocumentoSchema = DocumentoSchema
export const UpdateDocumentoSchema = z.object({
  descricao: stringOptional(),
  metadados: stringOptional(),
  ativo: z.boolean().optional(),
})

// ============================================================================
// 13) DIMENSÕES DE QUALIDADE
// ============================================================================

export const DimensaoQualidadeSchema = z.object({
  nome: stringRequired(1, "Nome"),
  descricao: stringRequired(1, "Descrição"),
  politicaId: uuidRequired("Política"),
})

export const CreateDimensaoQualidadeSchema = DimensaoQualidadeSchema
export const UpdateDimensaoQualidadeSchema = DimensaoQualidadeSchema.partial()

// ============================================================================
// 14) REGRAS DE NEGÓCIO
// ============================================================================

export const RegraNegocioSchema = z.object({
  descricao: stringRequired(1, "Descrição"),
  politicaId: z.uuid(),
  sistemaId: z.uuid().nullable().optional(),
  responsavelId: z.uuid(),
  termoId: z.uuid(),
})

export const CreateRegraNegocioSchema = RegraNegocioSchema
export const UpdateRegraNegocioSchema = RegraNegocioSchema.partial()

// ============================================================================
// 15) REGRAS DE QUALIDADE
// ============================================================================

export const RegraQualidadeSchema = z.object({
  descricao: stringRequired(1, "Descrição"),
  regraNegocioId: z.uuid().nullable().optional(),
  dimensaoId: z.uuid(),
  tabelaId: z.uuid(),
  colunaId: z.uuid(),
  responsavelId: z.uuid(),
})

export const CreateRegraQualidadeSchema = RegraQualidadeSchema
export const UpdateRegraQualidadeSchema = RegraQualidadeSchema.partial()

// ============================================================================
// 16) PARTES ENVOLVIDAS
// ============================================================================

export const ParteEnvolvidaSchema = z.object({
  nome: stringRequired(1, "Nome"),
  descricao: stringOptional(),
})

export const CreateParteEnvolvidaSchema = ParteEnvolvidaSchema
export const UpdateParteEnvolvidaSchema = ParteEnvolvidaSchema.partial()

// ============================================================================
// 17) REGULAÇÃO
// ============================================================================

export const RegulacaoSchema = z.object({
  nome: stringRequired(1, "Nome"),
  epigrafe: stringRequired(1, "Epígrafe"),
  descricao: stringRequired(1, "Descrição"),
  orgaoRegulador: stringOptional(),
  vigencia: stringOptional(),
})

export const CreateRegulacaoSchema = RegulacaoSchema
export const UpdateRegulacaoSchema = RegulacaoSchema.partial()

// ============================================================================
// 18) CRITICIDADE REGULATÓRIA
// ============================================================================

export const CriticidadeRegulatoriaSchema = z.object({
  regulacaoId: uuidRequired("Regulação"),
  regraQualidadeId: uuidRequired("Regra de Qualidade"),
  grauCriticidade: z.enum(['BAIXA', 'MEDIA', 'ALTA', 'CRITICA']),
})

export const CreateCriticidadeRegulatoriaSchema = CriticidadeRegulatoriaSchema
export const UpdateCriticidadeRegulatoriaSchema = CriticidadeRegulatoriaSchema.partial()

// ============================================================================
// 18) KPIS
// ============================================================================

export const KPISchema = z.object({
  nome: stringRequired(1, "Nome"),
  comunidadeId: stringOptional(),
  processoId: stringOptional(),
})

export const CreateKPISchema = KPISchema
export const UpdateKPISchema = KPISchema.partial()

// ============================================================================
// 19) PROCESSOS
// ============================================================================

export const ProcessoSchema = z.object({
  nome: stringRequired(1, "Nome"),
  descricao: stringOptional(),
})

export const CreateProcessoSchema = ProcessoSchema
export const UpdateProcessoSchema = ProcessoSchema.partial()

// ============================================================================
// 20) PRODUTO DE DADOS
// ============================================================================

export const ProdutoDadosSchema = z.object({
  nome: stringRequired(1, "Nome"),
  descricao: stringOptional(),
})

export const CreateProdutoDadosSchema = ProdutoDadosSchema
export const UpdateProdutoDadosSchema = ProdutoDadosSchema.partial()

// ============================================================================
// 21) ATIVIDADES
// ============================================================================

export const AtividadeSchema = z.object({
  nome: stringRequired(1, "Nome"),
  descricao: stringOptional(),
})

export const CreateAtividadeSchema = AtividadeSchema
export const UpdateAtividadeSchema = AtividadeSchema.partial()

// ============================================================================
// 22) OPERAÇÕES
// ============================================================================

export const OperacaoSchema = z.object({
  nome: stringRequired(1, "Nome"),
  descricao: stringOptional(),
})

export const CreateOperacaoSchema = OperacaoSchema
export const UpdateOperacaoSchema = OperacaoSchema.partial()

// ============================================================================
// 26) USUÁRIOS
// ============================================================================

export const UsuarioSchema = z.object({
  nome: stringRequired(2, "Nome"),
  email: z.string().email("Email inválido"),
  senha: stringOptional(),
  ativo: z.boolean().optional(),
})

export const CreateUsuarioSchema = UsuarioSchema.extend({
  senha: stringRequired(6, "Senha"),
})

export const UpdateUsuarioSchema = UsuarioSchema.partial()

// Schemas especiais para autenticação
export const LoginSchema = z.object({
  email: z.string().email("Email inválido"),
  senha: stringRequired(1, "Senha"),
})

export const RegisterSchema = CreateUsuarioSchema

export const ChangePasswordSchema = z.object({
  senhaAtual: stringRequired(1, "Senha atual"),
  novaSenha: stringRequired(6, "Nova senha"),
})

// ============================================================================
// REPOSITÓRIOS DE DOCUMENTO
// ============================================================================

export const RepositorioDocumentoSchema = z.object({
  nome: stringRequired(1, "Nome"),
  tipo: stringRequired(1, "Tipo"),
  localizacao: stringRequired(1, "Localização"),
  responsavel: stringRequired(1, "Responsável"),
  descricao: stringOptional(),
})

export const CreateRepositorioDocumentoSchema = RepositorioDocumentoSchema
export const UpdateRepositorioDocumentoSchema = RepositorioDocumentoSchema.partial()

// ============================================================================
// DOCUMENTO REPOSITÓRIO (TERMO ↔ REPOSITÓRIO)
// ============================================================================

export const DocumentoRepositorioSchema = z.object({
  termoId: uuidRequired("Termo"),
  repositorioId: uuidRequired("Repositório"),
})

export const CreateDocumentoRepositorioSchema = DocumentoRepositorioSchema
export const UpdateDocumentoRepositorioSchema = DocumentoRepositorioSchema.partial()

// ============================================================================
// MFA (AUTENTICAÇÃO MULTIFATOR)
// ============================================================================

export const MfaSchema = z.object({
  tipo: z.enum(['TOTP', 'SMS', 'EMAIL']),
  status: z.enum(['ATIVO', 'INATIVO']),
  configuracao: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
  backup_codes: z.array(z.string()).optional(),
})

export const MfaVerifySchema = z.object({
  codigo: stringRequired(1, "Código"),
  tipo: z.enum(['TOTP', 'SMS', 'BACKUP']).optional(),
})

// ============================================================================
// TIPOS INFERIDOS DOS SCHEMAS
// ============================================================================

// 1) Necessidade de Informação
export type NecessidadeInformacaoFormData = z.infer<typeof NecessidadeInformacaoSchema>
export type CreateNecessidadeInformacaoFormData = z.infer<typeof CreateNecessidadeInformacaoSchema>
export type UpdateNecessidadeInformacaoFormData = z.infer<typeof UpdateNecessidadeInformacaoSchema>

// 2) Políticas Internas
export type PoliticaInternaFormData = z.infer<typeof PoliticaInternaSchema>
export type CreatePoliticaInternaFormData = z.infer<typeof CreatePoliticaInternaSchema>
export type UpdatePoliticaInternaFormData = z.infer<typeof UpdatePoliticaInternaSchema>

// 3) Papéis de Governança
export type PapelFormData = z.infer<typeof PapelSchema>
export type CreatePapelFormData = z.infer<typeof CreatePapelSchema>
export type UpdatePapelFormData = z.infer<typeof UpdatePapelSchema>

// 4) Comunidades
export type ComunidadeFormData = z.infer<typeof ComunidadeSchema>
export type CreateComunidadeFormData = z.infer<typeof CreateComunidadeSchema>
export type UpdateComunidadeFormData = z.infer<typeof UpdateComunidadeSchema>

// 5) Atribuições
export type AtribuicaoFormData = z.infer<typeof AtribuicaoSchema>
export type CreateAtribuicaoFormData = z.infer<typeof CreateAtribuicaoSchema>
export type UpdateAtribuicaoFormData = z.infer<typeof UpdateAtribuicaoSchema>

// 6) Definições (Termos)
export type DefinicaoFormData = z.infer<typeof DefinicaoSchema>
export type CreateDefinicaoFormData = z.infer<typeof CreateDefinicaoSchema>
export type UpdateDefinicaoFormData = z.infer<typeof UpdateDefinicaoSchema>

// 7) Listas de Classificação
export type ListaClassificacaoFormData = z.infer<typeof ListaClassificacaoSchema>
export type CreateListaClassificacaoFormData = z.infer<typeof CreateListaClassificacaoSchema>
export type UpdateListaClassificacaoFormData = z.infer<typeof UpdateListaClassificacaoSchema>

// 8) Classificações de Informação
export type ClassificacaoInformacaoFormData = z.infer<typeof ClassificacaoInformacaoSchema>
export type CreateClassificacaoInformacaoFormData = z.infer<typeof CreateClassificacaoInformacaoSchema>
export type UpdateClassificacaoInformacaoFormData = z.infer<typeof UpdateClassificacaoInformacaoSchema>

// 9) Sistemas
export type SistemaFormData = z.infer<typeof SistemaSchema>
export type CreateSistemaFormData = z.infer<typeof CreateSistemaSchema>
export type UpdateSistemaFormData = z.infer<typeof UpdateSistemaSchema>

// 9) Bancos
export type BancoFormData = z.infer<typeof BancoSchema>
export type CreateBancoFormData = z.infer<typeof CreateBancoSchema>
export type UpdateBancoFormData = z.infer<typeof UpdateBancoSchema>

// 10) Tabelas
export type TabelaFormData = z.infer<typeof TabelaSchema>
export type CreateTabelaFormData = z.infer<typeof CreateTabelaSchema>
export type UpdateTabelaFormData = z.infer<typeof UpdateTabelaSchema>

// 10) Colunas
export type ColunaFormData = z.infer<typeof ColunaSchema>
export type CreateColunaFormData = z.infer<typeof CreateColunaSchema>
export type UpdateColunaFormData = z.infer<typeof UpdateColunaSchema>

// 10) Tipos de Dados
export type TipoDadosFormData = z.infer<typeof TipoDadosSchema>
export type CreateTipoDadosFormData = z.infer<typeof CreateTipoDadosSchema>
export type UpdateTipoDadosFormData = z.infer<typeof UpdateTipoDadosSchema>

// 11) Listas de Referência
export type ListaReferenciaFormData = z.infer<typeof ListaReferenciaSchema>
export type CreateListaReferenciaFormData = z.infer<typeof CreateListaReferenciaSchema>
export type UpdateListaReferenciaFormData = z.infer<typeof UpdateListaReferenciaSchema>

// 12) Documentos
export type DocumentoFormData = z.infer<typeof DocumentoSchema>
export type CreateDocumentoFormData = z.infer<typeof CreateDocumentoSchema>
export type UpdateDocumentoFormData = z.infer<typeof UpdateDocumentoSchema>

// 13) Dimensões de Qualidade
export type DimensaoQualidadeFormData = z.infer<typeof DimensaoQualidadeSchema>
export type CreateDimensaoQualidadeFormData = z.infer<typeof CreateDimensaoQualidadeSchema>
export type UpdateDimensaoQualidadeFormData = z.infer<typeof UpdateDimensaoQualidadeSchema>

// 14) Regras de Negócio
export type RegraNegocioFormData = z.infer<typeof RegraNegocioSchema>
export type CreateRegraNegocioFormData = z.infer<typeof CreateRegraNegocioSchema>
export type UpdateRegraNegocioFormData = z.infer<typeof UpdateRegraNegocioSchema>

// 15) Regras de Qualidade
export type RegraQualidadeFormData = z.infer<typeof RegraQualidadeSchema>
export type CreateRegraQualidadeFormData = z.infer<typeof CreateRegraQualidadeSchema>
export type UpdateRegraQualidadeFormData = z.infer<typeof UpdateRegraQualidadeSchema>

// 16) Partes Envolvidas
export type ParteEnvolvidaFormData = z.infer<typeof ParteEnvolvidaSchema>
export type CreateParteEnvolvidaFormData = z.infer<typeof CreateParteEnvolvidaSchema>
export type UpdateParteEnvolvidaFormData = z.infer<typeof UpdateParteEnvolvidaSchema>

// 17) Regulação
export type RegulacaoFormData = z.infer<typeof RegulacaoSchema>
export type CreateRegulacaoFormData = z.infer<typeof CreateRegulacaoSchema>
export type UpdateRegulacaoFormData = z.infer<typeof UpdateRegulacaoSchema>

// 18) Criticidade Regulatória
export type CriticidadeRegulatoriaFormData = z.infer<typeof CriticidadeRegulatoriaSchema>
export type CreateCriticidadeRegulatoriaFormData = z.infer<typeof CreateCriticidadeRegulatoriaSchema>
export type UpdateCriticidadeRegulatoriaFormData = z.infer<typeof UpdateCriticidadeRegulatoriaSchema>

// 19) KPIs
export type KPIFormData = z.infer<typeof KPISchema>
export type CreateKPIFormData = z.infer<typeof CreateKPISchema>
export type UpdateKPIFormData = z.infer<typeof UpdateKPISchema>

// 19) Processos
export type ProcessoFormData = z.infer<typeof ProcessoSchema>
export type CreateProcessoFormData = z.infer<typeof CreateProcessoSchema>
export type UpdateProcessoFormData = z.infer<typeof UpdateProcessoSchema>

// 20) Produtos de Dados
export type ProdutoDadosFormData = z.infer<typeof ProdutoDadosSchema>
export type CreateProdutoDadosFormData = z.infer<typeof CreateProdutoDadosSchema>
export type UpdateProdutoDadosFormData = z.infer<typeof UpdateProdutoDadosSchema>

// 21) Atividades
export type AtividadeFormData = z.infer<typeof AtividadeSchema>
export type CreateAtividadeFormData = z.infer<typeof CreateAtividadeSchema>
export type UpdateAtividadeFormData = z.infer<typeof UpdateAtividadeSchema>

// 22) Operações
export type OperacaoFormData = z.infer<typeof OperacaoSchema>
export type CreateOperacaoFormData = z.infer<typeof CreateOperacaoSchema>
export type UpdateOperacaoFormData = z.infer<typeof UpdateOperacaoSchema>

// 26) Usuários
export type UsuarioFormData = z.infer<typeof UsuarioSchema>
export type CreateUsuarioFormData = z.infer<typeof CreateUsuarioSchema>
export type UpdateUsuarioFormData = z.infer<typeof UpdateUsuarioSchema>
export type LoginFormData = z.infer<typeof LoginSchema>
export type RegisterFormData = z.infer<typeof RegisterSchema>
export type ChangePasswordFormData = z.infer<typeof ChangePasswordSchema>

// Repositórios de Documento
export type RepositorioDocumentoFormData = z.infer<typeof RepositorioDocumentoSchema>
export type CreateRepositorioDocumentoFormData = z.infer<typeof CreateRepositorioDocumentoSchema>
export type UpdateRepositorioDocumentoFormData = z.infer<typeof UpdateRepositorioDocumentoSchema>

// Documento Repositório (Termo ↔ Repositório)
export type DocumentoRepositorioFormData = z.infer<typeof DocumentoRepositorioSchema>
export type CreateDocumentoRepositorioFormData = z.infer<typeof CreateDocumentoRepositorioSchema>
export type UpdateDocumentoRepositorioFormData = z.infer<typeof UpdateDocumentoRepositorioSchema>

// MFA
export type MfaFormData = z.infer<typeof MfaSchema>
export type MfaVerifyFormData = z.infer<typeof MfaVerifySchema>
