import type { Usuario as ApiUsuario } from "./api";

export type Usuario = ApiUsuario;

export interface UsuarioStats {
  total: number;
  ativos: number;
  inativos: number;
  porPerfil?: Record<string, number>;
}
