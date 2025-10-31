"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TermoStatsCards } from "@/components/termos/termo-stats-cards"
import { TermoFilters } from "@/components/termos/termo-filters"
import { TermoForm } from "@/components/termos/termo-form"
import { ConfirmDeleteDialog } from "@/components/termos/confirm-delete-dialog"
import { useDefinicoes, useDeleteDefinicao } from "@/hooks/api/use-definicoes"
import { type DefinicaoResponse } from "@/types/api"

export default function TermosPage() {
  const { data: response } = useDefinicoes()
  const deleteMutation = useDeleteDefinicao()
  const termos = response?.data ?? []

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTermo, setEditingTermo] = useState<DefinicaoResponse | undefined>(undefined)
  const [termoToDelete, setTermoToDelete] = useState<DefinicaoResponse | null>(null)

  // Estatísticas dos termos
  const stats = useMemo(() => {
    const total = termos.length
    const ativos = termos.filter(t => t.ativo).length
    const inativos = termos.filter(t => !t.ativo).length
    return { total, ativos, inativos }
  }, [termos])

  const handleNewTermo = () => {
    setEditingTermo(undefined)
    setIsFormOpen(true)
  }

  const handleEditTermo = (termo: DefinicaoResponse) => {
    setEditingTermo(termo)
    setIsFormOpen(true)
  }

  const handleDeleteTermo = (termo: DefinicaoResponse) => {
    setTermoToDelete(termo)
  }

  const handleConfirmDelete = async () => {
    if (termoToDelete) {
      await deleteMutation.mutateAsync(termoToDelete.id)
      setTermoToDelete(null)
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Termos de Negócio
        </h1>
        <p className="text-muted-foreground">
          Gerencie os termos e definições do sistema DECODE-GOV
        </p>
      </div>

      <TermoStatsCards stats={stats} />

      <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-lg">
        <CardHeader>
          <CardTitle className="text-foreground">Lista de Termos</CardTitle>
          <CardDescription className="text-muted-foreground">
            Visualize e gerencie todos os termos cadastrados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <TermoFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            onNewTermo={handleNewTermo}
          />

          <TermoTable
            data={termos}
            searchTerm={searchTerm}
            selectedStatus={selectedStatus}
            onEdit={handleEditTermo}
            onDelete={handleDeleteTermo}
          />
        </CardContent>
      </Card>

      <TermoForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        termo={editingTermo}
      />

      <ConfirmDeleteDialog
        open={!!termoToDelete}
        onClose={() => setTermoToDelete(null)}
        termo={termoToDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
