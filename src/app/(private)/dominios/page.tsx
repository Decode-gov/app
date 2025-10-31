"use client"

import { useState } from "react"
import { Plus, Network } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useComunidades, useDeleteComunidade } from "@/hooks/api/use-comunidades"
import { ComunidadeForm } from "@/components/dominios/comunidade-form"
import { DominiosDataTable } from "@/components/dominios/dominios-data-table"
import { createColumns } from "@/components/dominios/columns"
import { ComunidadeResponse } from "@/types/api"

export default function DominiosPage() {
  const [formOpen, setFormOpen] = useState(false)
  const [editingComunidade, setEditingComunidade] = useState<ComunidadeResponse | undefined>()

  // Filtros server-side via query params
  const { data: comunidadesData, isLoading, error } = useComunidades({
    page: 1,
    limit: 1000,
  })
  const deleteMutation = useDeleteComunidade()

  const comunidades = comunidadesData?.data || []

  const handleEdit = (comunidade: ComunidadeResponse) => {
    setEditingComunidade(comunidade)
    setFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta comunidade?")) {
      try {
        await deleteMutation.mutateAsync(id)
      } catch (error) {
        console.error('Erro ao excluir comunidade:', error)
      }
    }
  }

  const handleNewComunidade = () => {
    setEditingComunidade(undefined)
    setFormOpen(true)
  }

  const getParentNome = (parentId?: string) => {
    if (!parentId) return null
    const parent = comunidades.find(c => c.id === parentId)
    return parent?.nome || null
  }

  const getRootComunidades = () => {
    return comunidades.filter(c => !c.parentId)
  }

  const getChildrenComunidades = (parentId: string) => {
    return comunidades.filter(c => c.parentId === parentId)
  }

  const columns = createColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
    getParentNome,
    getChildrenCount: (id: string) => getChildrenComunidades(id).length,
  })

  const parentOptions = comunidades
    .filter(c => !c.parentId)
    .map(c => ({ id: c.id, nome: c.nome }))

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Domínios de dados
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie os domínios de dados e sua hierarquia de governança de dados
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-[100px] bg-muted rounded" />
                <div className="h-8 w-8 bg-muted rounded-lg" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-[60px] bg-muted rounded mb-2" />
                <div className="h-3 w-[120px] bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardContent className="space-y-4 pt-6">
            <div className="flex items-center gap-2">
              <div className="h-10 w-[300px] bg-muted rounded" />
              <div className="h-10 w-[200px] bg-muted rounded" />
            </div>
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 w-full bg-muted rounded" />
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
            Domínios de dados
          </h1>
          <p className="text-muted-foreground mt-2">
            Erro ao carregar domínios de dados
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Domínios de dados
        </h1>
        <p className="text-muted-foreground mt-2">
          Gerencie os domínios de dados e sua hierarquia de governança de dados
        </p>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Comunidades</CardTitle>
            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
              <Network className="h-4 w-4 text-primary transition-colors duration-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{comunidades.length}</div>
            <p className="text-xs text-muted-foreground">
              Total de domínios cadastrados
            </p>
          </CardContent>
        </Card>
        
        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Domínio raiz</CardTitle>
            <div className="p-2 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors duration-300">
              <Network className="h-4 w-4 text-blue-600 transition-colors duration-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{getRootComunidades().length}</div>
            <p className="text-xs text-muted-foreground">Sem domínio pai</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de dados */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Domínios de dados</CardTitle>
              <CardDescription>
                Lista de todos os domínios de dados cadastrados
              </CardDescription>
            </div>
            <Button className="gap-2" onClick={handleNewComunidade}>
              <Plus className="h-4 w-4" />
              Novo Domínio de Dados
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <DominiosDataTable
            columns={columns}
            data={comunidades}
            parentOptions={parentOptions}
          />
        </CardContent>
      </Card>

      {/* Formulário de Criação/Edição */}
      <ComunidadeForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open)
          if (!open) {
            setEditingComunidade(undefined)
          }
        }}
        comunidade={editingComunidade}
      />
    </div>
  )
}
