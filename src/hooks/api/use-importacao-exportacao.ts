import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { toast } from 'sonner';
import { importacaoExportacaoService } from '@/services/importacao-exportacao';
import { ImportacaoExportacaoResponse, ImportacaoExportacaoBody, ApiError } from '@/types/api';

/**
 * Hooks para gerenciar importação e exportação
 */

/**
 * Hook para listar operações de importação/exportação
 */
export function useImportacaoExportacao(): UseQueryResult<ImportacaoExportacaoResponse[], ApiError> {
  return useQuery({
    queryKey: ['importacao-exportacao'],
    queryFn: () => importacaoExportacaoService.list(),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
}

/**
 * Hook para buscar operação por ID
 */
export function useImportacaoExportacaoDetail(id: string, enabled = true): UseQueryResult<ImportacaoExportacaoResponse, ApiError> {
  return useQuery({
    queryKey: ['importacao-exportacao', id],
    queryFn: () => importacaoExportacaoService.getById(id),
    enabled: !!id && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

/**
 * Hook para importar dados
 */
export function useImportar(): UseMutationResult<ImportacaoExportacaoResponse, ApiError, ImportacaoExportacaoBody & { arquivo: File }> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ImportacaoExportacaoBody & { arquivo: File }) =>
      importacaoExportacaoService.importar(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['importacao-exportacao'] });
      toast.success('Importação iniciada com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao iniciar importação:', error);
      toast.error(error.message || 'Erro ao iniciar importação');
    },
  });
}

/**
 * Hook para exportar dados
 */
export function useExportar(): UseMutationResult<ImportacaoExportacaoResponse, ApiError, ImportacaoExportacaoBody> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ImportacaoExportacaoBody) =>
      importacaoExportacaoService.exportar(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['importacao-exportacao'] });
      toast.success('Exportação iniciada com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro ao iniciar exportação:', error);
      toast.error(error.message || 'Erro ao iniciar exportação');
    },
  });
}