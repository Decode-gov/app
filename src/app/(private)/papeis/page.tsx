"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, UserCheck } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { usePapeis, useDeletePapel } from "@/hooks/api/use-papeis"
import { usePoliticasInternas } from "@/hooks/api/use-politicas-internas"
import { PapelGovernancaForm } from "@/components/papeis/papel-governanca-form"
import { PapeisDataTable } from "@/components/papeis/papeis-data-table"
import { createColumns } from "@/components/papeis/columns"
import { PapelResponse } from "@/types/api"

export default function PapeisPage() {
  const [formOpen, setFormOpen] = useState(false)
  const [selectedPapel, setSelectedPapel] = useState<PapelResponse | undefined>()

  const { data: papeisData, isLoading, error } = usePapeis({
    page: 1,
    limit: 1000,
  })
  const { data: politicasData } = usePoliticasInternas({ page: 1, limit: 1000 })
  const deletePapel = useDeletePapel()

  // Extração dos arrays de dados
  const papeis = papeisData?.data ?? []
  const politicas = politicasData?.data ?? []

  const handleEdit = (papel: PapelResponse) => {
    setSelectedPapel(papel)
    setFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este papel?")) {
      await deletePapel.mutateAsync(id)
    }
  }

  // Obter nome da política
  const getPoliticaNome = (politicaId: string) => {
    const politica = politicas.find(p => p.id === politicaId)
    return politica?.nome || "Política não encontrada"
  }

  const columns = createColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
    getPoliticaNome,
  })

  const politicaOptions = politicas.map(p => ({ id: p.id, nome: p.nome }))

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Papéis
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie os papéis de governança do sistema DECODE-GOV
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-20" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-[400px] w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Papéis
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie os papéis de governança do sistema DECODE-GOV
          </p>
        </div>
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">
              Erro ao carregar dados. Tente novamente.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Papéis
        </h1>
        <p className="text-muted-foreground mt-2">
          Gerencie os papéis de governança do sistema DECODE-GOV
        </p>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Papéis</CardTitle>
            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
              <UserCheck className="h-4 w-4 text-primary transition-colors duration-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{papeis.length}</div>
            <p className="text-xs text-muted-foreground">papéis cadastrados</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Políticas Associadas</CardTitle>
            <div className="p-2 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors duration-300">
              <UserCheck className="h-4 w-4 text-blue-600 transition-colors duration-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {politicas.length}
            </div>
            <p className="text-xs text-muted-foreground">políticas disponíveis</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de dados */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Papéis de Governança</CardTitle>
              <CardDescription>
                Lista de todos os papéis cadastrados no sistema
              </CardDescription>
            </div>
            <Button className="gap-2" onClick={() => {
              setSelectedPapel(undefined)
              setFormOpen(true)
            }}>
              <Plus className="h-4 w-4" />
              Novo Papel
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <PapeisDataTable
            columns={columns}
            data={papeis}
            politicaOptions={politicaOptions}
          />
        </CardContent>
      </Card>

      {/* Formulário de Criação/Edição */}
      <PapelGovernancaForm 
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open)
          if (!open) {
            setSelectedPapel(undefined)
          }
        }}
        papel={selectedPapel}
      />
    </div>
  )
}