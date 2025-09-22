"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ClassificacaoStatsCards } from "@/components/classificacoes/classificacao-stats-cards"
import { ClassificacaoFilters } from "@/components/classificacoes/classificacao-filters"
import { ClassificacaoTable } from "@/components/classificacoes/classificacao-table"
import { ClassificacaoForm } from "@/components/classificacoes/classificacao-form"
import { ConfirmDeleteDialog } from "@/components/classificacoes/confirm-delete-dialog"
import { type Classificacao, type ClassificacaoFormData, type ClassificacaoStats } from "@/types/classificacao"

// Mock data - substituir por chamadas reais da API
const mockClassificacoes: Classificacao[] = [
  {
    id: "1",
    nome: "Dados Pessoais",
    descricao: "Classificação para informações de dados pessoais conforme LGPD",
    politicaId: "2",
    termoId: "1",
    criadoEm: new Date("2024-01-15"),
    atualizadoEm: new Date("2024-01-15"),
  },
  {
    id: "2", 
    nome: "Informação Confidencial",
    descricao: "Classificação para informações que devem ser protegidas contra acesso não autorizado",
    politicaId: "1",
    termoId: "3",
    criadoEm: new Date("2024-01-16"),
    atualizadoEm: new Date("2024-01-16"),
  },
  {
    id: "3",
    nome: "Dados Sensíveis",
    descricao: "Classificação para dados pessoais sensíveis que requerem proteção especial",
    politicaId: "2",
    termoId: "2",
    criadoEm: new Date("2024-01-17"),
    atualizadoEm: new Date("2024-01-17"),
  },
  {
    id: "4",
    nome: "Documento Público",
    descricao: "Classificação para documentos de acesso público",
    politicaId: "4",
    termoId: "4",
    criadoEm: new Date("2024-01-18"),
    atualizadoEm: new Date("2024-01-18"),
  },
  {
    id: "5",
    nome: "Informação Restrita",
    descricao: "Classificação para informações altamente confidenciais",
    politicaId: "1",
    criadoEm: new Date("2024-02-01"),
    atualizadoEm: new Date("2024-02-01"),
  },
]

export default function ClassificacoesPage() {
  const [classificacoes, setClassificacoes] = useState<Classificacao[]>(mockClassificacoes)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [politicaFilter, setPoliticaFilter] = useState("todos")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedClassificacao, setSelectedClassificacao] = useState<Classificacao | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Filtrar classificações
  const filteredClassificacoes = useMemo(() => {
    return classificacoes.filter((classificacao) => {
      const matchesSearch = 
        classificacao.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (classificacao.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
      
      const matchesStatus = statusFilter === "todos"

      const matchesPolitica = 
        politicaFilter === "todos" ||
        classificacao.politicaId === politicaFilter

      return matchesSearch && matchesStatus && matchesPolitica
    })
  }, [classificacoes, searchTerm, statusFilter, politicaFilter])

  // Calcular estatísticas
  const stats: ClassificacaoStats = useMemo(() => {
    const total = classificacoes.length
    const ativos = classificacoes.length // Todas são consideradas ativas no novo schema
    const inativos = 0
    
    const porPolitica = classificacoes.reduce((acc, classificacao) => {
      acc[classificacao.politicaId] = (acc[classificacao.politicaId] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return { total, ativos, inativos, porPolitica }
  }, [classificacoes])

  const handleCreate = async (data: ClassificacaoFormData) => {
    setIsSubmitting(true)
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newClassificacao: Classificacao = {
        id: Date.now().toString(),
        ...data,
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      }
      
      setClassificacoes(prev => [...prev, newClassificacao])
      setIsFormOpen(false)
      setSelectedClassificacao(null)
    } catch (error) {
      console.error("Erro ao criar classificação:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = async (data: ClassificacaoFormData) => {
    if (!selectedClassificacao) return
    
    setIsSubmitting(true)
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setClassificacoes(prev => 
        prev.map(classificacao => 
          classificacao.id === selectedClassificacao.id 
            ? { ...classificacao, ...data, atualizadoEm: new Date() }
            : classificacao
        )
      )
      
      setIsFormOpen(false)
      setSelectedClassificacao(null)
    } catch (error) {
      console.error("Erro ao editar classificação:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedClassificacao) return
    
    setIsDeleting(true)
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setClassificacoes(prev => 
        prev.filter(classificacao => classificacao.id !== selectedClassificacao.id)
      )
      
      setIsDeleteDialogOpen(false)
      setSelectedClassificacao(null)
    } catch (error) {
      console.error("Erro ao excluir classificação:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  const openEditForm = (classificacao: Classificacao) => {
    setSelectedClassificacao(classificacao)
    setIsFormOpen(true)
  }

  const openDeleteDialog = (classificacao: Classificacao) => {
    setSelectedClassificacao(classificacao)
    setIsDeleteDialogOpen(true)
  }

  const openCreateForm = () => {
    setSelectedClassificacao(null)
    setIsFormOpen(true)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("todos")
    setPoliticaFilter("todos")
  }

  return (
    <div className="space-y-8">
      <div className="animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Classificações de Informação
            </h1>
            <p className="text-muted-foreground mt-2">
              Gerencie as classificações de segurança e privacidade das informações
            </p>
          </div>
          <Button 
            onClick={openCreateForm}
            className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nova Classificação
          </Button>
        </div>
      </div>

      <ClassificacaoStatsCards stats={stats} />

      <div className="space-y-6">
        <ClassificacaoFilters
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          politicaFilter={politicaFilter}
          onPoliticaFilterChange={setPoliticaFilter}
          onClearFilters={clearFilters}
          resultsCount={filteredClassificacoes.length}
        />

        <ClassificacaoTable
          data={filteredClassificacoes}
          onEdit={openEditForm}
          onDelete={openDeleteDialog}
        />
      </div>

      <ClassificacaoForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        classificacao={selectedClassificacao}
        onSubmit={selectedClassificacao ? handleEdit : handleCreate}
        isSubmitting={isSubmitting}
      />

      <ConfirmDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        classificacao={selectedClassificacao}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </div>
  )
}
