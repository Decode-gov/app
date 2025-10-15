import { BaseService } from './base';
import type {
  ProdutoDadosResponse,
  ProdutoDadosBody,
  UpdateProdutoDadosBody
} from '@/types/api';

class ProdutosDadosService extends BaseService<
  ProdutoDadosResponse,
  ProdutoDadosBody,
  UpdateProdutoDadosBody
> {
  constructor() {
    super('/produtos-dados');
  }
}

export const produtosDadosService = new ProdutosDadosService();