"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, Filter, Plus } from "lucide-react"

interface UserFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  selectedStatus: string | null
  onStatusChange: (status: string | null) => void
  onNewUser: () => void
}

export function UserFilters({ 
  searchTerm, 
  onSearchChange, 
  selectedStatus, 
  onStatusChange, 
  onNewUser 
}: UserFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center animate-slide-in-left">
      <div className="flex flex-1 gap-2 max-w-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar usuários..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-background/50 backdrop-blur-sm border-border focus:border-primary/50 transition-colors duration-200"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className={`gap-2 bg-background/50 backdrop-blur-sm border-border hover:bg-accent/50 ${selectedStatus ? 'border-primary/50' : ''}`}>
              <Filter className="h-4 w-4" />
              {selectedStatus === 'ativo' ? 'Ativos' : selectedStatus === 'inativo' ? 'Inativos' : 'Status'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onStatusChange(null)}>
              Todos
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange("ativo")}>
              Ativos
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange("inativo")}>
              Inativos
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex gap-2">
        <Button
          className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-200"
          onClick={onNewUser}
        >
          <Plus className="h-4 w-4" />
          Novo Usuário
        </Button>
      </div>
    </div>
  )
}
