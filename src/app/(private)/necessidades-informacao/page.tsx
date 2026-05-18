"use client"

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen } from "lucide-react";
import {
  useGetNecessidadesInformacao,
  useDeleteNecessidadesInformacaoId,
  getGetNecessidadesInformacaoQueryKey,
} from "@/api/generated/endpoints/necessidades-informacao/necessidades-informacao";
import { NecessidadeForm, NecessidadesTable } from "@/components/necessidades";
import { Skeleton } from "@/components/ui/skeleton";
import { NecessidadeInformacaoResponse } from "@/types/api";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function NecessidadesInformacaoPage() {
  const queryClient = useQueryClient()
  const [formOpen, setFormOpen] = useState(false)
  const [selectedNecessidade, setSelectedNecessidade] = useState<NecessidadeInformacaoResponse | undefined>()

  const { data: necessidadesData, isLoading, error } = useGetNecessidadesInformacao()
  const deleteNecessidade = useDeleteNecessidadesInformacaoId({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getGetNecessidadesInformacaoQueryKey()
        })
        toast.success('Necessidade de informação removido com sucesso!')
      },
      onError: () => {
        queryClient.invalidateQueries({
          queryKey: getGetNecessidadesInformacaoQueryKey()
        })
        toast.error('Falha ao remover Necessidade de informação!')
      }
    }
  })

  // Extração do array de dados
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const necessidades = (necessidadesData?.data ?? []) as any[]

  const handleEdit = (necessidade: NecessidadeInformacaoResponse) => {
    setSelectedNecessidade(necessidade)
    setFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    await deleteNecessidade.mutateAsync({ id })
  }

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
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-destructive">
            Necessidades de Informação
          </h1>
          <p className="text-muted-foreground mt-2">
            Erro ao carregar necessidades de informação
          </p>
        </div>
      </div>
    )
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
            <Button className="gap-2" onClick={() => {
              setSelectedNecessidade(undefined)
              setFormOpen(true)
            }}>
              <Plus className="h-4 w-4" />
              Nova Necessidade
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <NecessidadesTable
            data={necessidades}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>      {/* Formulário de Criação/Edição */}
      <NecessidadeForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open)
          if (!open) {
            setSelectedNecessidade(undefined)
          }
        }}
        necessidade={selectedNecessidade}
      />
    </div>
  )
}