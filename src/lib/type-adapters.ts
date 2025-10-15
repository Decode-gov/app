/**
 * Adaptadores de tipos para converter respostas da API para os tipos existentes da aplicação
 */

import type { KPI } from '@/types';
import type { PoliticaInterna } from '@/types';
import type { KpiResponse, PoliticaInternaResponse } from '@/types/api';

/**
 * Converte KpiResponse para KPI
 */
export function adaptKpiResponse(response: KpiResponse): KPI {
  return {
    id: response.id,
    nome: response.nome,
    objetivoDescricao: response.objetivoDescricao || '',
    calculo: response.calculo || '',
    periodicidade: response.periodicidade || 'mensal',
    areaGerenciamento: response.areaGerenciamento || '',
    responsavelId: response.responsavelId || response.usuarioId,
    processoId: response.processoId,
    createdAt: response.createdAt,
    updatedAt: response.updatedAt
  };
}

/**
 * Converte array de KpiResponse para array de KPI
 */
export function adaptKpiResponseArray(responses: KpiResponse[]): KPI[] {
  return responses.map(adaptKpiResponse);
}

/**
 * Converte PoliticaInternaResponse para PoliticaInterna
 */
export function adaptPoliticaInternaResponse(response: PoliticaInternaResponse): PoliticaInterna {
  // Mapear status da API para os status esperados
  const statusMap: Record<string, "Vigente" | "Em elaboração" | "Revogada"> = {
    'ATIVA': 'Vigente',
    'EM_REVISAO': 'Em elaboração',
    'REVOGADA': 'Revogada',
    'Vigente': 'Vigente',
    'Em elaboração': 'Em elaboração',
    'Revogada': 'Revogada'
  };

  return {
    id: parseInt(response.id), // Convertendo string para number
    nome: response.nome,
    categoria: response.categoria || response.escopo || 'GOVERNANCA',
    descricao: response.descricao || '',
    objetivo: response.objetivo || '',
    escopo: response.escopo,
    status: statusMap[response.status] || 'Em elaboração',
    responsavel: 'Responsável', // Valor padrão
    dataCriacao: response.createdAt,
    dataVigenciaInicio: response.dataInicioVigencia,
    dataTermino: response.dataTermino,
    versao: '1.0', // Valor padrão se não existir na API
    createdAt: response.createdAt,
    updatedAt: response.updatedAt
  };
}

/**
 * Converte array de PoliticaInternaResponse para array de PoliticaInterna
 */
export function adaptPoliticaInternaResponseArray(responses: PoliticaInternaResponse[]): PoliticaInterna[] {
  return responses.map(adaptPoliticaInternaResponse);
}

/**
 * Converte KPI para KpiResponse (para envio à API)
 */
export function adaptKpiForApi(kpi: Partial<KPI>): Partial<KpiResponse> {
  return {
    nome: kpi.nome,
    descricao: kpi.objetivoDescricao, // Usando objetivoDescricao como descricao
    objetivoDescricao: kpi.objetivoDescricao,
    calculo: kpi.calculo,
    periodicidade: kpi.periodicidade,
    areaGerenciamento: kpi.areaGerenciamento,
    responsavelId: kpi.responsavelId,
    processoId: kpi.processoId,
    usuarioId: kpi.responsavelId
  };
}

/**
 * Converte PoliticaInterna para PoliticaInternaResponse (para envio à API)
 */
export function adaptPoliticaInternaForApi(politica: Partial<PoliticaInterna>): Partial<PoliticaInternaResponse> {
  // Mapear status de volta para a API
  const statusMap: Record<string, "ATIVA" | "EM_REVISAO" | "REVOGADA"> = {
    'Vigente': 'ATIVA',
    'Em elaboração': 'EM_REVISAO',
    'Revogada': 'REVOGADA'
  };

  return {
    nome: politica.nome,
    descricao: politica.descricao,
    categoria: politica.categoria,
    objetivo: politica.objetivo,
    status: politica.status ? statusMap[politica.status] : 'EM_REVISAO',
    dataInicioVigencia: politica.dataVigenciaInicio || new Date().toISOString(),
    dataTermino: politica.dataTermino,
    escopo: 'GOVERNANCA' // Valor padrão
  };
}