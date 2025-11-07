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
import { PapelResponse } from "@/types/api"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"

interface ColumnsProps {
  onEdit: (papel: PapelResponse) => void
  onDelete: (id: string) => void
  getPoliticaNome: (politicaId: string) => string
}

export const createColumns = ({
  onEdit,
  onDelete,
  getPoliticaNome,
}: ColumnsProps): ColumnDef<PapelResponse>[] => [
    {
      accessorKey: "nome",
      header: "Nome",
      cell: ({ row }) => {
        const papel = row.original

        return (
          <div className="font-medium max-w-[200px] truncate" title={papel.nome}>
            {papel.nome}
          </div>
        )
      },
    },
    {
      accessorKey: "descricao",
      header: "Descrição",
      cell: ({ row }) => {
        const papel = row.original
        return (
          <Tooltip>
            <TooltipTrigger>
              <span className="font-medium max-w-[200px] truncate">{papel.descricao || '-'}</span>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-wrap">{papel.descricao || '-'}</p>
            </TooltipContent>
          </Tooltip>
        )
      },
    },
    {
      accessorKey: "politicaId",
      header: "Política",
      cell: ({ row }) => {
        const politicaId = row.getValue("politicaId") as string
        const politicaNome = getPoliticaNome(politicaId)

        return (
          <Badge variant="secondary" className="max-w-[200px] truncate">
            {politicaNome}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }) => {
        const papel = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(papel)}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(papel.id)}
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
