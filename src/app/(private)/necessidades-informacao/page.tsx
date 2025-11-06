"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, BookOpen } from "lucide-react"
import { useNecessidadesInformacao, useDeleteNecessidadeInformacao } from "@/hooks/api/use-necessidades-informacao"
import { NecessidadeForm, NecessidadesTable } from "@/components/necessidades"
import { Skeleton } from "@/components/ui/skeleton"
import { NecessidadeInformacaoResponse } from "@/types/api"

export default function NecessidadesInformacaoPage() {
  const [page] = useState(1)
  const [limit] = useState(10)
  const [formOpen, setFormOpen] = useState(false)
  const [selectedNecessidade, setSelectedNecessidade] = useState<NecessidadeInformacaoResponse | undefined>()

  const { data: necessidadesData, isLoading, error } = useNecessidadesInformacao({
    page,
    limit,
  })
  const deleteNecessidade = useDeleteNecessidadeInformacao()

  // Extração do array de dados
  const necessidades = necessidadesData?.data ?? []

  const handleEdit = (necessidade: NecessidadeInformacaoResponse) => {
    setSelectedNecessidade(necessidade)
    setFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta necessidade de informação?")) {
      await deleteNecessidade.mutateAsync(id)
    }
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

        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
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

      {/* Card de estatística */}
      <Card className="group hover:shadow-lg transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Necessidades</CardTitle>
          <div className="p-2 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors duration-300">
            <BookOpen className="h-4 w-4 text-blue-600 transition-colors duration-300" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {necessidades.length}
          </div>
          <p className="text-xs text-muted-foreground">necessidades cadastradas</p>
        </CardContent>
      </Card>

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