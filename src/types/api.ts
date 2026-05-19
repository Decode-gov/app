import type {
  GetAtribuicoes200,
  GetBancos200,
  GetClassificacoesInformacao200,
  GetColunas200,
  GetComitesAprovadores200,
  GetComunidades200,
  GetCriticidadesRegulatorias200,
  GetDefinicoes200,
  GetDimensoesQualidade200,
  GetKpis200,
  GetListasClassificacao200,
  GetNecessidadesInformacao200,
  GetPapeis200,
  GetPoliticasInternas200,
  GetProdutosDados200,
  GetRegrasNegocio200,
  GetRegrasQualidade200,
  GetRegulacoesCompletas200,
  GetRepositoriosDocumento200,
  GetSistemas200,
  GetTabelas200,
  GetUsuarios200,
} from "@/api/generated/model";

export type NecessidadeInformacaoResponse = GetNecessidadesInformacao200["data"][number];
export type PapelResponse = GetPapeis200["data"][number];
export type ComunidadeResponse = GetComunidades200["data"][number];
export type AtribuicaoResponse = GetAtribuicoes200["data"][number];
export type DefinicaoResponse = GetDefinicoes200["data"][number];
export type ListaClassificacaoResponse = GetListasClassificacao200["data"][number];
export type ClassificacaoInformacaoResponse = GetClassificacoesInformacao200["data"][number];
export type BancoResponse = GetBancos200["data"][number];
export type RepositorioDocumentoResponse = GetRepositoriosDocumento200["data"][number];
export type SistemaResponse = GetSistemas200["data"][number];
export type TabelaResponse = GetTabelas200["data"][number];
export type ColunaResponse = GetColunas200["data"][number];
export type RegraNegocioResponse = GetRegrasNegocio200["data"][number];
export type DimensaoQualidadeResponse = GetDimensoesQualidade200["data"][number];
export type RegraQualidadeResponse = GetRegrasQualidade200["data"][number];
export type RegulacaoResponse = GetRegulacoesCompletas200["data"][number];
export type CriticidadeRegulatoriaResponse = GetCriticidadesRegulatorias200["data"][number];
export type KpiResponse = GetKpis200["data"][number];
export type ProdutoDadosResponse = GetProdutosDados200["data"][number];

export type GetUsuarios200DataItem = GetUsuarios200["data"][number];
export type Usuario = GetUsuarios200DataItem;

export type GetPoliticasInternas200DataItem = GetPoliticasInternas200["data"][number];
export type GetComiteAprovador200DataItem = GetComitesAprovadores200['data'][number];
