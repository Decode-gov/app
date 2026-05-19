"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Edit, MoreHorizontal, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { GetEmpresas200DataItem } from "@/api/generated/model"

interface ColumnsProps {
  onEdit: (empresa: GetEmpresas200DataItem) => void
  onDelete: (id: string) => void
}

export const createColumns = ({
  onEdit,
  onDelete,
}: ColumnsProps): ColumnDef<GetEmpresas200DataItem>[] => [
  {
    accessorKey: "nome",
    header: "Nome",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("nome")}</span>
    ),
  },
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      const id = row.getValue("id") as string
      return (
        <span className="text-muted-foreground text-xs font-mono">
          {id.slice(0, 8)}...
        </span>
      )
    },
  },
  {
    accessorKey: "deletedAt",
    header: "Status",
    cell: ({ row }) => {
      const deletedAt = row.getValue("deletedAt") as string | null | undefined
      return deletedAt ? (
        <Badge variant="destructive">Inativo</Badge>
      ) : (
        <Badge variant="outline">Ativo</Badge>
      )
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const empresa = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(empresa)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => onDelete(empresa.id)}
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
