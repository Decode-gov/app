import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  useGetImportacaoExportacao,
  useGetImportacaoExportacaoId,
  postImportacaoExportacaoImportar,
  postImportacaoExportacaoExportar,
  getGetImportacaoExportacaoQueryKey,
} from '@/api/generated/endpoints/importacao-exportacao/importacao-exportacao';
import type {
  PostImportacaoExportacaoImportarBody,
  PostImportacaoExportacaoExportarParams,
} from '@/api/generated/model';

export function useImportacaoExportacao() {
  return useGetImportacaoExportacao();
}

export function useImportacaoExportacaoDetail(id: string, enabled = true) {
  return useGetImportacaoExportacaoId(id, { query: { enabled: !!id && enabled } });
}

export function useImportar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PostImportacaoExportacaoImportarBody) => postImportacaoExportacaoImportar(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetImportacaoExportacaoQueryKey() });
      toast.success('Importação iniciada com sucesso!');
    },
    onError: () => toast.error('Erro ao iniciar importação'),
  });
}

export function useExportar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: PostImportacaoExportacaoExportarParams) => postImportacaoExportacaoExportar(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetImportacaoExportacaoQueryKey() });
      toast.success('Exportação iniciada com sucesso!');
    },
    onError: () => toast.error('Erro ao iniciar exportação'),
  });
}
