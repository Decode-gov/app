"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Edit, Trash2, Eye, Network } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ComunidadeResponse } from "@/types/api"

interface ColumnsProps {
  onEdit: (comunidade: ComunidadeResponse) => void
  onDelete: (id: string) => void
  getParentNome: (parentId?: string) => string | null
  getChildrenCount: (id: string) => number
}

export const createColumns = ({
  onEdit,
  onDelete,
  getParentNome,
  getChildrenCount,
}: ColumnsProps): ColumnDef<ComunidadeResponse>[] => [
  {
    accessorKey: "nome",
    header: "Nome",
    cell: ({ row }) => {
      const comunidade = row.original
      const childrenCount = getChildrenCount(comunidade.id)
      const hasChildren = childrenCount > 0

      return (
        <div className="flex items-center gap-2 max-w-[200px]">
          <span className="font-medium">{comunidade.nome}</span>
          {hasChildren && (
            <Badge variant="outline" className="text-xs">
              <Network className="h-3 w-3 mr-1" />
              {childrenCount}
            </Badge>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "parentId",
    header: "Hierarquia",
    cell: ({ row }) => {
      const parentId = row.getValue("parentId") as string | undefined
      const parentNome = getParentNome(parentId)

      return parentNome ? (
        <Badge variant="secondary" className="text-xs">
          {parentNome}
        </Badge>
      ) : (
        <Badge variant="outline" className="text-xs">
          Raiz
        </Badge>
      )
    },
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => {
      const comunidade = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              Ver detalhes
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(comunidade)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(comunidade.id)}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
