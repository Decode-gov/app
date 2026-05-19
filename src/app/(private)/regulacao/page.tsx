"use client";

import { FileText, Plus } from "lucide-react";
import { useState } from "react";
import {
  useDeleteRegulacoesCompletasId,
  useGetRegulacoesCompletas,
} from "@/api/generated/endpoints/regulações-completas/regulações-completas";
import type { GetRegulacoesCompletas200Output } from "@/api/generated/model/getRegulacoesCompletas200.zod";
import { RegulacaoForm } from "@/components/regulacao/regulacao-form";
import { RegulacoesTable } from "@/components/regulacao/regulacao-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type RegulacaoItem = GetRegulacoesCompletas200Output["data"][number];

export default function RegulacaoPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [selectedRegulacao, setSelectedRegulacao] = useState<RegulacaoItem | undefined>();

  const { data: regulacoesData, isLoading, error } = useGetRegulacoesCompletas();
  const deleteRegulacao = useDeleteRegulacoesCompletasId();

  const regulacoes = regulacoesData?.data ?? [];

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta regulação?")) {
      await deleteRegulacao.mutateAsync({ id });
    }
  };

  const handleEdit = (regulacao: RegulacaoItem) => {
    setSelectedRegulacao(regulacao);
    setFormOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Regulação
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie regulamentações e normativas aplicáveis
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => i).map((key) => (
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
          <h1 className="text-3xl font-bold tracking-tight text-destructive">Regulação</h1>
          <p className="text-muted-foreground mt-2">Erro ao carregar regulações</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Regulação
        </h1>
        <p className="text-muted-foreground mt-2">
          Gerencie regulamentações e normativas aplicáveis no sistema DECODE-GOV
        </p>
      </div>

      <Card className="group hover:shadow-lg transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Regulações</CardTitle>
          <div className="p-2 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors duration-300">
            <FileText className="h-4 w-4 text-blue-600 transition-colors duration-300" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{regulacoes.length}</div>
          <p className="text-xs text-muted-foreground">regulações cadastradas</p>
        </CardContent>
      </Card>

      <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Regulações</CardTitle>
              <CardDescription>Lista de todas as regulações cadastradas</CardDescription>
            </div>
            <Button
              className="gap-2"
              onClick={() => {
                setSelectedRegulacao(undefined);
                setFormOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Nova Regulação
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <RegulacoesTable
            data={regulacoes}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      <RegulacaoForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setSelectedRegulacao(undefined);
        }}
        regulacao={selectedRegulacao}
      />
    </div>
  );
}
