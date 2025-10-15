"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X } from "lucide-react"

interface RegraFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  filters: {
    termoId?: string
    politicaId?: string
    sistemaId?: string
    responsavelId?: string
  }
  onFilterChange: (key: string, value: string) => void
  onClearFilters: () => void
}

export function RegraFilters({ 
  search, 
  onSearchChange, 
  filters, 
  onFilterChange, 
  onClearFilters 
}: RegraFiltersProps) {
  const hasFilters = Object.values(filters).some(Boolean) || search

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar regras de negócio..."
          className="pl-8"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        <div className="flex gap-2">
          <Select
            value={filters.termoId || ""}
            onValueChange={(value) => onFilterChange("termoId", value)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Termo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os termos</SelectItem>
              <SelectItem value="cliente">Cliente</SelectItem>
              <SelectItem value="produto">Produto</SelectItem>
              <SelectItem value="venda">Venda</SelectItem>
              <SelectItem value="dados-pessoais">Dados Pessoais</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.politicaId || ""}
            onValueChange={(value) => onFilterChange("politicaId", value)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Política" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas as políticas</SelectItem>
              <SelectItem value="privacidade">Privacidade</SelectItem>
              <SelectItem value="qualidade">Qualidade</SelectItem>
              <SelectItem value="seguranca">Segurança</SelectItem>
              <SelectItem value="governanca">Governança</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.sistemaId || ""}
            onValueChange={(value) => onFilterChange("sistemaId", value)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sistema" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os sistemas</SelectItem>
              <SelectItem value="vendas">Vendas</SelectItem>
              <SelectItem value="crm">CRM</SelectItem>
              <SelectItem value="erp">ERP</SelectItem>
              <SelectItem value="bi">BI</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.responsavelId || ""}
            onValueChange={(value) => onFilterChange("responsavelId", value)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Responsável" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os responsáveis</SelectItem>
              <SelectItem value="joao-silva">João Silva</SelectItem>
              <SelectItem value="maria-santos">Maria Santos</SelectItem>
              <SelectItem value="carlos-oliveira">Carlos Oliveira</SelectItem>
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