"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X } from "lucide-react"

interface ProdutoDadosFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  filters: {
    dominioId?: string
    regulacaoId?: string
    comTermos?: string
    comAtivos?: string
  }
  onFilterChange: (key: string, value: string) => void
  onClearFilters: () => void
}

export function ProdutoDadosFilters({ 
  search, 
  onSearchChange, 
  filters, 
  onFilterChange, 
  onClearFilters 
}: ProdutoDadosFiltersProps) {
  const hasFilters = Object.values(filters).some(Boolean) || search

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar produtos de dados..."
          className="pl-8"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        <div className="flex gap-2">
          <Select
            value={filters.dominioId || "todos"}
            onValueChange={(value) => onFilterChange("dominioId", value === "todos" ? "" : value)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Domínio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os domínios</SelectItem>
              <SelectItem value="financeiro">Financeiro</SelectItem>
              <SelectItem value="rh">Recursos Humanos</SelectItem>
              <SelectItem value="vendas">Vendas</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.regulacaoId || "todas"}
            onValueChange={(value) => onFilterChange("regulacaoId", value === "todas" ? "" : value)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Regulação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as regulações</SelectItem>
              <SelectItem value="lgpd">LGPD</SelectItem>
              <SelectItem value="bacen">BACEN</SelectItem>
              <SelectItem value="cvm">CVM</SelectItem>
              <SelectItem value="susep">SUSEP</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.comTermos || "todos"}
            onValueChange={(value) => onFilterChange("comTermos", value === "todos" ? "" : value)}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Termos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="sim">Com termos</SelectItem>
              <SelectItem value="nao">Sem termos</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.comAtivos || "todos"}
            onValueChange={(value) => onFilterChange("comAtivos", value === "todos" ? "" : value)}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Ativos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="sim">Com ativos</SelectItem>
              <SelectItem value="nao">Sem ativos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {hasFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="h-10"
          >
            <X className="mr-2 h-4 w-4" />
            Limpar
          </Button>
        )}
      </div>
    </div>
  )
}