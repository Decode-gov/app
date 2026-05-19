"use client";

import { Plus, Workflow } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import {
  useDeleteAtribuicoesId,
  useGetAtribuicoes,
} from "@/api/generated/endpoints/atribuições-papel-domínio/atribuições-papel-domínio";
import { useGetComunidades } from "@/api/generated/endpoints/comunidades/comunidades";
import { useGetPapeis } from "@/api/generated/endpoints/papéis/papéis";
import { AtribuicaoForm } from "@/components/atribuicoes/atribuicao-form";
import { AtribuicoesTable } from "@/components/atribuicoes/atribuicoes-table";
import { getAtribuicoesColumns } from "@/components/atribuicoes/atribuicoes-table-columns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { AtribuicaoResponse } from "@/types/api";

export default function AtribuicoesPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [selectedAtribuicao, setSelectedAtribuicao] = useState<AtribuicaoResponse | undefined>();

  const { data: atribuicoesData, isLoading, error } = useGetAtribuicoes();
  const { data: papeisData } = useGetPapeis();
  const { data: comunidadesData } = useGetComunidades();
  const deleteAtribuicao = useDeleteAtribuicoesId();

  // Memoização dos dados
  const papeis = useMemo(() => papeisData?.data ?? [], [papeisData?.data]);
  const dominios = useMemo(() => comunidadesData?.data ?? [], [comunidadesData?.data]);
  const atribuicoes = useMemo(() => atribuicoesData?.data ?? [], [atribuicoesData?.data]);

  // Handlers para as ações da tabela
  const handleEdit = useCallback((atribuicao: AtribuicaoResponse) => {
    setSelectedAtribuicao(atribuicao);
    setFormOpen(true);
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      if (confirm("Tem certeza que deseja excluir esta atribuição?")) {
        await deleteAtribuicao.mutateAsync({ id });
      }
    },
    [deleteAtribuicao],
  );

  // Colunas da tabela
  const columns = useMemo(
    () => getAtribuicoesColumns({ onEdit: handleEdit, onDelete: handleDelete }),
    [handleEdit, handleDelete],
  );

  // Opções de filtros
  const filterOptions = useMemo(
    () => [
      {
        column: "papel.nome",
        label: "Filtrar por Papel",
        options: papeis.map((papel) => ({
          label: papel.nome,
          value: papel.nome,
        })),
      },
      {
        column: "dominio.nome",
        label: "Filtrar por Domínio",
        options: dominios.map((dominio) => ({
          label: dominio.nome,
          value: dominio.nome,
        })),
      },
    ],
    [papeis, dominios],
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Atribuições Papel↔Domínio
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie as atribuições entre papéis e domínios
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
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
          <h1 className="text-3xl font-bold tracking-tight text-destructive">
            Atribuições Papel↔Domínio
          </h1>
          <p className="text-muted-foreground mt-2">Erro ao carregar atribuições</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Atribuições Papel↔Domínio
        </h1>
        <p className="text-muted-foreground mt-2">
          Gerencie as atribuições entre papéis e domínios do sistema DECODE-GOV
        </p>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Atribuições</CardTitle>
            <div className="p-2 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors duration-300">
              <Workflow className="h-4 w-4 text-blue-600 transition-colors duration-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{atribuicoes.length}</div>
            <p className="text-xs text-muted-foreground">atribuições cadastradas</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Com Onboarding</CardTitle>
            <div className="p-2 rounded-lg bg-green-100 group-hover:bg-green-200 transition-colors duration-300">
              <Workflow className="h-4 w-4 text-green-600 transition-colors duration-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {atribuicoes.filter((a) => a.onboarding).length}
            </div>
            <p className="text-xs text-muted-foreground">requerem onboarding</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vigentes</CardTitle>
            <div className="p-2 rounded-lg bg-purple-100 group-hover:bg-purple-200 transition-colors duration-300">
              <Workflow className="h-4 w-4 text-purple-600 transition-colors duration-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{atribuicoes.length}</div>
            <p className="text-xs text-muted-foreground">atribuições ativas</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de dados */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Atribuições Cadastradas</CardTitle>
              <CardDescription>
                Lista de todas as atribuições entre papéis e domínios cadastradas
              </CardDescription>
            </div>
            <Button
              className="gap-2"
              onClick={() => {
                setSelectedAtribuicao(undefined);
                setFormOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Nova Atribuição
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <AtribuicoesTable
            columns={columns}
            data={atribuicoes}
            searchPlaceholder="Buscar por nome..."
            filters={filterOptions}
          />
        </CardContent>
      </Card>

      {/* Formulário de Criação/Edição */}
      <AtribuicaoForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) {
            setSelectedAtribuicao(undefined);
          }
        }}
        atribuicao={selectedAtribuicao}
      />
    </div>
  );
}
