"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TermoStatsCards } from "@/components/termos/termo-stats-cards"
import { TermoFilters } from "@/components/termos/termo-filters"
import { TermoForm } from "@/components/termos/termo-form"
import { ConfirmDeleteDialog } from "@/components/termos/confirm-delete-dialog"
import { type Termo, type TermoFormData } from "@/types/termo"
import { TermoTable } from "@/components/termos/termo-table"

// Dados de exemplo para simular a API
const mockTermos: Termo[] = [
  {
    id: "1",
    nome: "Dado Pessoal",
    descricao: "Informação relacionada a pessoa natural identificada ou identificável",
    sigla: "DP",
    ativo: true,
  },
  {
    id: "2",
    nome: "Titular de Dados",
    descricao: "Pessoa natural a quem se referem os dados pessoais que são objeto de tratamento",
    sigla: "TD",
    ativo: true,
  },
  {
    id: "3",
    nome: "Controlador",
    descricao: "Pessoa natural ou jurídica, de direito público ou privado, a quem competem as decisões referentes ao tratamento de dados pessoais",
    sigla: null,
    ativo: true,
  },
  {
    id: "4",
    nome: "Operador",
    descricao: "Pessoa natural ou jurídica, de direito público ou privado, que realiza o tratamento de dados pessoais em nome do controlador",
    sigla: null,
    ativo: true,
  },
  {
    id: "5",
    nome: "Anonimização",
    descricao: "Utilização de meios técnicos razoáveis e disponíveis no momento do tratamento, por meio dos quais um dado perde a possibilidade de associação, direta ou indireta, a um indivíduo",
    sigla: null,
    ativo: false,
  },
]

export default function TermosPage() {
  const [termos, setTermos] = useState<Termo[]>(mockTermos)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTermo, setEditingTermo] = useState<Termo | null>(null)
  const [termoToDelete, setTermoToDelete] = useState<Termo | null>(null)

  // Estatísticas dos termos
  const stats = useMemo(() => {
    const total = termos.length
    const ativos = termos.filter(t => t.ativo).length
    const inativos = termos.filter(t => !t.ativo).length
    return { total, ativos, inativos }
  }, [termos])

  const handleNewTermo = () => {
    setEditingTermo(null)
    setIsFormOpen(true)
  }

  const handleEditTermo = (termo: Termo) => {
    setEditingTermo(termo)
    setIsFormOpen(true)
  }

  const handleDeleteTermo = (termo: Termo) => {
    setTermoToDelete(termo)
  }

  const handleConfirmDelete = () => {
    if (termoToDelete) {
      setTermos(prev => prev.filter(t => t.id !== termoToDelete.id))
      setTermoToDelete(null)
    }
  }

  const handleSubmitTermo = async (data: TermoFormData) => {
    try {
      if (editingTermo) {
        // Editar termo existente
        setTermos(prev => prev.map(t => 
          t.id === editingTermo.id 
            ? { ...t, ...data } 
            : t
        ))
      } else {
        // Criar novo termo
        const newTermo: Termo = {
          id: Date.now().toString(),
          ...data,
        }
        setTermos(prev => [...prev, newTermo])
      }
      setIsFormOpen(false)
      setEditingTermo(null)
    } catch (error) {
      console.error("Erro ao salvar termo:", error)
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
        onClose={() => setIsFormOpen(false)}
        termo={editingTermo}
        onSubmit={handleSubmitTermo}
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
