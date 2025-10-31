"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { DefinicaoResponse } from "@/types/api"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface ColumnsProps {
  onEdit: (termo: DefinicaoResponse) => void
  onDelete: (id: string) => void
}

export const createColumns = ({
  onEdit,
  onDelete,
}: ColumnsProps): ColumnDef<DefinicaoResponse>[] => [
  {
    accessorKey: "termo",
    header: "Termo",
    cell: ({ row }) => {
      return <span className="font-medium">{row.getValue("termo")}</span>
    },
  },
  {
    accessorKey: "definicao",
    header: "Definição",
    cell: ({ row }) => {
      const definicao = row.getValue("definicao") as string | undefined
      return (
        <div className="max-w-[400px] truncate">
          {definicao || <span className="text-muted-foreground">-</span>}
        </div>
      )
    },
  },
  {
    accessorKey: "sigla",
    header: "Sigla",
    cell: ({ row }) => {
      const sigla = row.getValue("sigla") as string | undefined
      return sigla ? (
        <Badge variant="outline">{sigla}</Badge>
      ) : (
        <span className="text-muted-foreground">-</span>
      )
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const termo = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(termo)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => onDelete(termo.id)}
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
