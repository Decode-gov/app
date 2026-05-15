import { BaseService } from './base';

export interface EmpresaResponse {
  id: string;
  nome: string;
  deletedAt?: string | null;
}

export interface CreateEmpresaBody {
  nome: string;
}

export type UpdateEmpresaBody = Partial<CreateEmpresaBody>;

class EmpresaService extends BaseService<EmpresaResponse, CreateEmpresaBody, UpdateEmpresaBody> {
  constructor() {
    super('/empresas');
  }
}

export const empresaService = new EmpresaService();
