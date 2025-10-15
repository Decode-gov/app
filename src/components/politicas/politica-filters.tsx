"use client"

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
import { Search, X, Filter } from "lucide-react"

interface PoliticaFiltersProps {
  searchTerm: string
  onSearchTermChange: (value: string) => void
  statusFilter: string
  onStatusFilterChange: (value: string) => void
  categoriaFilter: string
  onCategoriaFilterChange: (value: string) => void
  onClearFilters: () => void
  resultsCount: number
}

export function PoliticaFilters({
  searchTerm,
  onSearchTermChange,
  statusFilter,
  onStatusFilterChange,
  categoriaFilter,
  onCategoriaFilterChange,
  onClearFilters,
  resultsCount,
}: PoliticaFiltersProps) {
  const hasActiveFilters = searchTerm || statusFilter !== "todos" || categoriaFilter !== "todos"

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Busca */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar políticas..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="pl-10 bg-background/50 backdrop-blur-sm border-border/60 focus:border-primary/50 transition-colors duration-200"
          />
        </div>

        {/* Filtro por Status */}
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-full sm:w-[180px] bg-background/50 backdrop-blur-sm border-border/60">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os status</SelectItem>
            <SelectItem value="Vigente">Vigentes</SelectItem>
            <SelectItem value="Em_elaboracao">Em Elaboração</SelectItem>
            <SelectItem value="Revogada">Revogadas</SelectItem>
          </SelectContent>
        </Select>

        {/* Filtro por Categoria */}
        <Select value={categoriaFilter} onValueChange={onCategoriaFilterChange}>
          <SelectTrigger className="w-full sm:w-[180px] bg-background/50 backdrop-blur-sm border-border/60">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todas as categorias</SelectItem>
            <SelectItem value="Privacidade">Privacidade</SelectItem>
            <SelectItem value="Classificação">Classificação</SelectItem>
            <SelectItem value="Retenção">Retenção</SelectItem>
            <SelectItem value="Backup">Backup</SelectItem>
            <SelectItem value="Segurança">Segurança</SelectItem>
          </SelectContent>
        </Select>

        {/* Limpar Filtros */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={onClearFilters}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
            Limpar
          </Button>
        )}
      </div>

      {/* Resumo dos resultados */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {resultsCount === 1 ? (
            <>Mostrando <strong>1</strong> política</>
          ) : (
            <>Mostrando <strong>{resultsCount}</strong> políticas</>
          )}
          {hasActiveFilters && " com filtros aplicados"}
        </div>

        {/* Filtros ativos */}
        {hasActiveFilters && (
          <div className="flex gap-2 flex-wrap">
            {searchTerm && (
              <Badge variant="secondary" className="gap-1">
                Busca: &quot;{searchTerm}&quot;
                <X 
                  className="h-3 w-3 cursor-pointer hover:bg-background/20 rounded-full" 
                  onClick={() => onSearchTermChange("")}
                />
              </Badge>
            )}
            {statusFilter !== "todos" && (
              <Badge variant="secondary" className="gap-1">
                Status: {statusFilter === "Vigente" ? "Vigentes" : 
                        statusFilter === "Em_elaboracao" ? "Em Elaboração" :
                        statusFilter === "Revogada" ? "Revogadas" : statusFilter}
                <X 
                  className="h-3 w-3 cursor-pointer hover:bg-background/20 rounded-full" 
                  onClick={() => onStatusFilterChange("todos")}
                />
              </Badge>
            )}
            {categoriaFilter !== "todos" && (
              <Badge variant="secondary" className="gap-1">
                Categoria: {categoriaFilter}
                <X 
                  className="h-3 w-3 cursor-pointer hover:bg-background/20 rounded-full" 
                  onClick={() => onCategoriaFilterChange("todos")}
                />
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  )
}