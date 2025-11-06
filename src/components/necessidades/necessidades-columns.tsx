"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Edit, Trash2, ArrowUpDown } from "lucide-react"
import { NecessidadeInformacaoResponse } from "@/types/api"

interface ActionsProps {
  necessidade: NecessidadeInformacaoResponse
  onEdit: (necessidade: NecessidadeInformacaoResponse) => void
  onDelete: (id: string) => void
}

const ActionsCell = ({ necessidade, onEdit, onDelete }: ActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Eye className="mr-2 h-4 w-4" />
          Ver detalhes
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit(necessidade)}>
          <Edit className="mr-2 h-4 w-4" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="text-destructive"
          onClick={() => onDelete(necessidade.id)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const createColumns = (
  onEdit: (necessidade: NecessidadeInformacaoResponse) => void,
  onDelete: (id: string) => void
): ColumnDef<NecessidadeInformacaoResponse>[] => [
  {
    accessorKey: "questaoGerencial",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Questão Gerencial
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="font-medium max-w-[300px]">
        <div className="truncate" title={row.getValue("questaoGerencial")}>
          {row.getValue("questaoGerencial")}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "origemQuestao",
    header: "Origem Questão",
    cell: ({ row }) => (
      <div className="max-w-[200px]">
        <div className="truncate" title={row.getValue("origemQuestao")}>
          {row.getValue("origemQuestao")}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Criado em
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {new Date(row.getValue("createdAt")).toLocaleDateString('pt-BR')}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => (
      <ActionsCell 
        necessidade={row.original} 
        onEdit={onEdit}
        onDelete={onDelete}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
]
