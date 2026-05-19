export interface Politica {
  id: string;
  nome: string;
  descricao?: string;
  versao: string;
  categoria: string;
  status: "Vigente" | "Em_elaboracao" | "Revogada" | string;
  responsavel: string;
  objetivo?: string;
  escopo?: string;
  dominioDadosId?: string | null;
  dataInicioVigencia: Date;
  dataCriacao: Date;
  dataTermino?: Date | null;
  anexosUrl?: string | null;
  relacionamento?: string | null;
  observacoes?: string | null;
}

export interface PoliticaStats {
  total: number;
  vigentes: number;
  emElaboracao: number;
  revogadas: number;
  porCategoria: Record<string, number>;
}
