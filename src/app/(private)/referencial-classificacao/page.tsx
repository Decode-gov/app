"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { FileText, Plus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useListasClassificacao, useDeleteListaClassificacao } from "@/hooks/api/use-listas-classificacao"
import { usePoliticasInternas } from "@/hooks/api/use-politicas-internas"
import { ListaClassificacaoResponse } from "@/types/api"
import { ReferencialForm } from "@/components/referencial/referencial-form"
import { ReferencialTable } from "@/components/referencial/referencial-table"
import { getReferencialColumns } from "@/components/referencial/referencial-table-columns"

export default function ReferencialClassificacaoPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedReferencial, setSelectedReferencial] = useState<ListaClassificacaoResponse | undefined>()

  const { data: referenciaisData, isLoading, error } = useListasClassificacao({})
  const { data: politicasData } = usePoliticasInternas()
  const deleteReferencial = useDeleteListaClassificacao()
  
  const politicas = useMemo(() => politicasData?.data || [], [politicasData?.data])
  const referenciais = useMemo(() => referenciaisData?.data || [], [referenciaisData?.data])

  // Handlers
  const handleEdit = (referencial: ListaClassificacaoResponse) => {
    setSelectedReferencial(referencial)
    setIsFormOpen(true)
  }

  const handleNew = () => {
    setSelectedReferencial(undefined)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este referencial de classificação?")) {
      await deleteReferencial.mutateAsync(id)
    }
  }

  // Colunas da tabela
  const columns = useMemo(
    () => getReferencialColumns({ 
      onEdit: handleEdit, 
      onDelete: handleDelete,
      politicas 
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [politicas]
  )

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Nível de confidencialidade adotado pela organização
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie os níveis de confidencialidade de informação do sistema DECODE-GOV
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-1">
          <Card>
            <CardHeader>
              <Skeleton className="h-4 w-20" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
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
            Nível de confidencialidade adotado pela organização
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie os níveis de confidencialidade de informação do sistema DECODE-GOV
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
    <>
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Nível de confidencialidade adotado pela organização
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie os níveis de confidencialidade de informação do sistema DECODE-GOV
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-1">
          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de tipologia de classificação</CardTitle>
              <div className="p-2 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors duration-300">
                <FileText className="h-4 w-4 text-accent group-hover:text-accent-foreground transition-colors duration-300" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{referenciais.length}</div>
              <p className="text-xs text-muted-foreground">tipologias cadastradas</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Nível de confidencialidade adotado pela organização</CardTitle>
                <CardDescription>
                  Lista de todos os níveis de confidencialidade cadastrados no sistema
                </CardDescription>
              </div>
              <Button className="gap-2" onClick={handleNew}>
                <Plus className="h-4 w-4" />
                Novo Nível
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ReferencialTable
              columns={columns}
              data={referenciais}
              searchPlaceholder="Buscar níveis de confidencialidade..."
            />
          </CardContent>
        </Card>
      </div>

      <ReferencialForm open={isFormOpen} onOpenChange={setIsFormOpen} referencial={selectedReferencial} />
    </>
  )
}
