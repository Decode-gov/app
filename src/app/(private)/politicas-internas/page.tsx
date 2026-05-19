"use client";

import { Plus, Shield } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import {
  useDeletePoliticasInternasId,
  useGetPoliticasInternas,
} from "@/api/generated/endpoints/políticas-internas/políticas-internas";
import { PoliticaInternaForm } from "@/components/politicas/politica-interna-form";
import { createColumns } from "@/components/politicas/politicas-internas-columns";
import { PoliticasInternasDataTable } from "@/components/politicas/politicas-internas-data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { GetPoliticasInternas200DataItem } from "@/types/api";

export default function PoliticasPage() {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [formOpen, setFormOpen] = useState(false);
  const [selectedPolitica, setSelectedPolitica] = useState<
    GetPoliticasInternas200DataItem | undefined
  >();

  const { data: politicasData, isLoading, error } = useGetPoliticasInternas();
  const { mutateAsync: deletePolitica } = useDeletePoliticasInternasId();

  const politicas = politicasData?.data ?? [];

  const handleDelete = useCallback(
    async (id: string) => {
      if (confirm("Tem certeza que deseja excluir esta política interna?")) {
        await deletePolitica({ id });
      }
    },
    [deletePolitica],
  );

  const handleEdit = useCallback((politica: GetPoliticasInternas200DataItem) => {
    setSelectedPolitica(politica);
    setFormOpen(true);
  }, []);

  // Criação das colunas com memoization
  const columns = useMemo(
    () =>
      createColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
      }),
    [handleEdit, handleDelete],
  );
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Políticas Internas
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie as políticas internas de governança de dados
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 3 }, (_, i) => i).map((key) => (
            <Card key={key} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[60px] mb-2" />
                <Skeleton className="h-3 w-[120px]" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-[300px]" />
              <Skeleton className="h-10 w-[100px]" />
            </div>
            <div className="space-y-3">
              {Array.from({ length: 5 }, (_, i) => i).map((key) => (
                <Skeleton key={key} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-destructive">Políticas Internas</h1>
          <p className="text-muted-foreground mt-2">Erro ao carregar políticas internas</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Políticas Internas
        </h1>
        <p className="text-muted-foreground mt-2">
          Gerencie as políticas internas de governança de dados do sistema DECODE-GOV
        </p>
      </div>

      {/* Cards de estatísticas por Status */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativas</CardTitle>
            <div className="p-2 rounded-lg bg-green-100 group-hover:bg-green-200 transition-colors duration-300">
              <Shield className="h-4 w-4 text-green-600 transition-colors duration-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {politicas.filter((p) => p.status === "Vigente").length}
            </div>
            <p className="text-xs text-muted-foreground">políticas vigentes</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Elaboração</CardTitle>
            <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-slate-200 transition-colors duration-300">
              <Shield className="h-4 w-4 text-slate-600 transition-colors duration-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-700">
              {politicas.filter((p) => p.status === "Em_elaboracao").length}
            </div>
            <p className="text-xs text-muted-foreground">em elaboração</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revogadas</CardTitle>
            <div className="p-2 rounded-lg bg-red-100 group-hover:bg-red-200 transition-colors duration-300">
              <Shield className="h-4 w-4 text-red-600 transition-colors duration-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {politicas.filter((p) => p.status === "Revogada").length}
            </div>
            <p className="text-xs text-muted-foreground">revogadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de dados */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Políticas Internas</CardTitle>
              <CardDescription>
                Lista de todas as políticas internas de governança cadastradas
              </CardDescription>
            </div>
            <Button
              className="gap-2"
              onClick={() => {
                setSelectedPolitica(undefined);
                setFormOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Nova Política
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <PoliticasInternasDataTable
            columns={columns}
            data={politicas}
            searchKey="nome"
            searchPlaceholder="Buscar políticas..."
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />
        </CardContent>
      </Card>

      {/* Formulário de Criação/Edição */}
      <PoliticaInternaForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) {
            setSelectedPolitica(undefined);
          }
        }}
        politica={selectedPolitica}
      />
    </div>
  );
}
