"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  getGetNecessidadesInformacaoQueryKey,
  useDeleteNecessidadesInformacaoId,
  useGetNecessidadesInformacao,
} from "@/api/generated/endpoints/necessidades-de-informação/necessidades-de-informação";
import { useEmpresaIdParam } from "@/hooks/use-empresa-id-param";
import { NecessidadeForm, NecessidadesTable } from "@/components/necessidades";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { NecessidadeInformacaoResponse } from "@/types/api";

export default function NecessidadesInformacaoPage() {
  const empresaParams = useEmpresaIdParam();
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [selectedNecessidade, setSelectedNecessidade] = useState<
    NecessidadeInformacaoResponse | undefined
  >();

  const { data: necessidadesData, isLoading, error } = useGetNecessidadesInformacao(empresaParams);
  const deleteNecessidade = useDeleteNecessidadesInformacaoId({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getGetNecessidadesInformacaoQueryKey(),
        });
        toast.success("Necessidade de informação removido com sucesso!");
      },
      onError: () => {
        queryClient.invalidateQueries({
          queryKey: getGetNecessidadesInformacaoQueryKey(),
        });
        toast.error("Falha ao remover Necessidade de informação!");
      },
    },
  });

  // Extração do array de dados
  const necessidades = necessidadesData?.data ?? [];

  const handleEdit = (necessidade: NecessidadeInformacaoResponse) => {
    setSelectedNecessidade(necessidade);
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteNecessidade.mutateAsync({ id });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Necessidades de Informação
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie as necessidades de informação identificadas
          </p>
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
          <h1 className="text-3xl font-bold tracking-tight text-destructive">
            Necessidades de Informação
          </h1>
          <p className="text-muted-foreground mt-2">Erro ao carregar necessidades de informação</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Necessidades de Informação
        </h1>
        <p className="text-muted-foreground mt-2">
          Gerencie as necessidades de informação identificadas no sistema DECODE-GOV
        </p>
      </div>
      {/* Tabela de dados */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Necessidades de Informação</CardTitle>
              <CardDescription>
                Lista de todas as necessidades de informação cadastradas
              </CardDescription>
            </div>
            <Button
              className="gap-2"
              onClick={() => {
                setSelectedNecessidade(undefined);
                setFormOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Nova Necessidade
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <NecessidadesTable data={necessidades} onEdit={handleEdit} onDelete={handleDelete} />
        </CardContent>
      </Card>{" "}
      {/* Formulário de Criação/Edição */}
      <NecessidadeForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) {
            setSelectedNecessidade(undefined);
          }
        }}
        necessidade={selectedNecessidade}
      />
    </div>
  );
}
