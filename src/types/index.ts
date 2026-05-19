import type { ProdutoDadosResponse, RegraNegocioResponse } from "./api";

export type ProdutoDados = ProdutoDadosResponse & {
  dominioId?: string | null;
  regulacaoId?: string | null;
  ativos?: unknown[];
  termos?: unknown[];
};

export type RegraNegocio = RegraNegocioResponse & {
  regra?: string;
};
