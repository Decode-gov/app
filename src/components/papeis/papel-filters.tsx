"use client"

import { Search, X, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface PapelFiltersProps {
  searchTerm: string
  onSearchTermChange: (value: string) => void
  politicaFilter: string
  onPoliticaFilterChange: (value: string) => void
  onClearFilters: () => void
  resultsCount: number
}

// Mock data das políticas para os filtros
const politicaOptions = [
  { value: "todos", label: "Todas as Políticas" },
  { value: "550e8400-e29b-41d4-a716-446655440001", label: "Política de Segurança da Informação" },
  { value: "550e8400-e29b-41d4-a716-446655440002", label: "Política de Privacidade de Dados" },
  { value: "550e8400-e29b-41d4-a716-446655440003", label: "Política de Retenção de Documentos" },
  { value: "550e8400-e29b-41d4-a716-446655440004", label: "Política de Classificação de Informações" },
]

export function PapelFilters({
  searchTerm,
  onSearchTermChange,
  politicaFilter,
  onPoliticaFilterChange,
  onClearFilters,
  resultsCount,
}: PapelFiltersProps) {
  const hasActiveFilters = searchTerm !== "" || politicaFilter !== "todos"
  const activePoliticaLabel = politicaOptions.find(opt => opt.value === politicaFilter)?.label

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por nome ou descrição..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="pl-10 bg-background/50 border-border/60 focus:border-primary/60"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted/30"
              onClick={() => onSearchTermChange("")}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:w-auto w-full">
          <Select value={politicaFilter} onValueChange={onPoliticaFilterChange}>
            <SelectTrigger className="sm:w-[280px] bg-background/50 border-border/60">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Filtrar por política" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {politicaOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={onClearFilters}
              className="bg-background/50 border-border/60 hover:bg-accent/50"
            >
              <X className="mr-2 h-4 w-4" />
              Limpar
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Filtros ativos:</span>
          
          {searchTerm && (
            <Badge variant="secondary" className="gap-1">
              Busca: &quot;{searchTerm}&quot;
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 hover:bg-transparent"
                onClick={() => onSearchTermChange("")}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {politicaFilter !== "todos" && (
            <Badge variant="secondary" className="gap-1">
              {activePoliticaLabel}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 hover:bg-transparent"
                onClick={() => onPoliticaFilterChange("todos")}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
        </div>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {resultsCount === 0
            ? "Nenhum resultado encontrado"
            : resultsCount === 1
            ? "1 papel encontrado"
            : `${resultsCount} papéis encontrados`}
        </p>
      </div>
    </div>
  )
}