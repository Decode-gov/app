"use client"

import { useState } from "react"
import { Plus, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useDefinicoes, useDeleteDefinicao } from "@/hooks/api/use-definicoes"
import { TermoForm } from "@/components/termos/termo-form"
import { TermosDataTable } from "@/components/termos/termos-data-table"
import { createColumns } from "@/components/termos/columns"
import { DefinicaoResponse } from "@/types/api"

export default function TermosNegocioPage() {
  const [formOpen, setFormOpen] = useState(false)
  const [selectedTermo, setSelectedTermo] = useState<DefinicaoResponse | undefined>()

  const { data: termosData, isLoading, error } = useDefinicoes()
  const { mutate: deleteTermo } = useDeleteDefinicao()

  const termos = termosData?.data || []

  const handleEdit = (termo: DefinicaoResponse) => {
    setSelectedTermo(termo)
    setFormOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este termo?")) {
      deleteTermo(id)
    }
  }

  const handleNewTermo = () => {
    setSelectedTermo(undefined)
    setFormOpen(true)
  }

  const handleCloseForm = () => {
    setFormOpen(false)
    setSelectedTermo(undefined)
  }

  const columns = createColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Termos de Negócio
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie o glossário de termos do sistema
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
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
            Termos de Negócio
          </h1>
          <p className="text-muted-foreground mt-2">
            Erro ao carregar termos de negócio
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Termos de Negócio
        </h1>
        <p className="text-muted-foreground mt-2">
          Gerencie o glossário de termos e definições do sistema DECODE-GOV
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid">
        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Termos</CardTitle>
            <div className="p-2 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors duration-300">
              <BookOpen className="h-4 w-4 text-blue-600 transition-colors duration-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{termos.length}</div>
            <p className="text-xs text-muted-foreground">termos cadastrados</p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Termos de Negócio</CardTitle>
            </div>
            <Button className="gap-2" onClick={handleNewTermo}>
              <Plus className="h-4 w-4" />
              Novo Termo
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <TermosDataTable columns={columns} data={termos} />
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <TermoForm open={formOpen} onOpenChange={handleCloseForm} termo={selectedTermo} />
    </div>
  )
}
