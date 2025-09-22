"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X } from "lucide-react"

interface ClassificacaoFiltersProps {
  searchTerm: string
  onSearchTermChange: (value: string) => void
  statusFilter: string
  onStatusFilterChange: (value: string) => void
  politicaFilter: string
  onPoliticaFilterChange: (value: string) => void
  onClearFilters: () => void
  resultsCount: number
}

// Mock data das políticas (simplificado para o filtro) - substituir por dados reais da API
const mockPoliticas = [
  { id: "1", nome: "Política de Segurança da Informação" },
  { id: "2", nome: "Política de Privacidade de Dados" },
  { id: "3", nome: "Política de Retenção de Documentos" },
  { id: "4", nome: "Política de Classificação de Informações" },
]

export function ClassificacaoFilters({
  searchTerm,
  onSearchTermChange,
  statusFilter,
  onStatusFilterChange,
  politicaFilter,
  onPoliticaFilterChange,
  onClearFilters,
  resultsCount
}: ClassificacaoFiltersProps) {
  const hasActiveFilters = searchTerm || statusFilter !== "todos" || politicaFilter !== "todos"

  return (
    <div className="bg-card/50 backdrop-blur-sm rounded-lg border border-border/60 p-4 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por nome ou descrição..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="pl-10 bg-background/50 border-border/60 focus:border-primary/60 transition-colors"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-full sm:w-[180px] bg-background/50 border-border/60">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
          </SelectContent>
        </Select>

        <Select value={politicaFilter} onValueChange={onPoliticaFilterChange}>
          <SelectTrigger className="w-full sm:w-[200px] bg-background/50 border-border/60">
            <SelectValue placeholder="Política" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todas as políticas</SelectItem>
            {mockPoliticas.map((politica) => (
              <SelectItem key={politica.id} value={politica.id}>
                {politica.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="whitespace-nowrap bg-background/50 border-border/60 hover:bg-accent/50"
          >
            <X className="h-4 w-4 mr-1" />
            Limpar
          </Button>
        )}
      </div>
      
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {resultsCount === 1 
            ? "1 classificação encontrada" 
            : `${resultsCount} classificações encontradas`}
        </span>
        {hasActiveFilters && (
          <span className="text-primary">
            Filtros ativos
          </span>
        )}
      </div>
    </div>
  )
}
