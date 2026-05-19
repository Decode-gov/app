export interface Papel {
  id: string;
  nome: string;
  descricao: string;
  politicaId: string;
  criadoEm: string | Date;
  atualizadoEm: string | Date;
}

export interface PapelStats {
  total: number;
  ativos: number;
  inativos: number;
  porPolitica: Record<string, number>;
}
