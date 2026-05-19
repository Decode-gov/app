"use client";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FolderOpen } from "lucide-react";
import {
  deleteArquivosId,
  getGetArquivosQueryKey,
  useGetArquivos,
} from "@/api/generated/endpoints/arquivos/arquivos";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/components/ui/data-table";
import { useEmpresaIdParam } from "@/hooks/use-empresa-id-param";
import { api } from "@/lib/api";
import { ArquivoUploadWidget } from "@/components/arquivos/arquivo-upload-widget";
import { createColumns } from "@/components/arquivos/columns";
import type { ArquivoItem } from "@/components/arquivos/columns";

export default function ArquivosPage() {
  const queryClient = useQueryClient();
  const empresaParams = useEmpresaIdParam();

  const { data: arquivosData, isLoading, error } = useGetArquivos(empresaParams);

  const arquivos = arquivosData?.data ?? [];

  const handleDownload = async (arquivo: ArquivoItem) => {
    try {
      const response = await api.get(`/arquivos/${arquivo.id}/download`, {
        responseType: "blob",
      });
      const url = URL.createObjectURL(response.data as Blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = arquivo.nomeOriginal;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Erro ao baixar arquivo");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este arquivo?")) return;
    try {
      await deleteArquivosId(id);
      await queryClient.invalidateQueries({ queryKey: getGetArquivosQueryKey() });
      toast.success("Arquivo excluído com sucesso!");
    } catch {
      toast.error("Erro ao excluir arquivo");
    }
  };

  const columns = createColumns({ onDownload: handleDownload, onDelete: handleDelete });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader />
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-[400px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader />
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">
              Erro ao carregar dados. Tente novamente.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader />

      <div className="grid gap-4 md:grid-cols-1">
        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Arquivos</CardTitle>
            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
              <FolderOpen className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{arquivos.length}</div>
            <p className="text-xs text-muted-foreground">arquivos armazenados</p>
          </CardContent>
        </Card>
      </div>

      <ArquivoUploadWidget />

      <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-lg">
        <CardHeader>
          <CardTitle>Arquivos</CardTitle>
          <CardDescription>Lista de todos os arquivos enviados</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={arquivos}
            searchKey="nomeOriginal"
            searchPlaceholder="Buscar arquivos..."
          />
        </CardContent>
      </Card>
    </div>
  );
}

function PageHeader() {
  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Arquivos
      </h1>
      <p className="text-muted-foreground mt-2">
        Gerencie os arquivos enviados pela empresa
      </p>
    </div>
  );
}
