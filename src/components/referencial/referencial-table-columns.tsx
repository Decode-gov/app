"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Edit, MoreHorizontal, Trash2 } from "lucide-react"
import { ListaClassificacaoResponse, PoliticaInternaResponse } from "@/types/api"

const CATEGORIA_CONFIG = {
  Publico: { label: "Público", color: "bg-green-500" },
  Interno: { label: "Interno", color: "bg-blue-500" },
  Confidencial: { label: "Confidencial", color: "bg-orange-500" },
  Restrito: { label: "Restrito", color: "bg-red-500" },
} as const

interface ColumnActionsProps {
  onEdit: () => void
  onDelete: () => void
}

function ColumnActions({ onEdit, onDelete }: ColumnActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem className="text-destructive" onClick={onDelete}>
          <Trash2 className="mr-2 h-4 w-4" />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface GetColumnsParams {
  onEdit: (referencial: ListaClassificacaoResponse) => void
  onDelete: (id: string) => void
  politicas?: PoliticaInternaResponse[]
}

export function getReferencialColumns({
  onEdit,
  onDelete,
  politicas = [],
}: GetColumnsParams): ColumnDef<ListaClassificacaoResponse>[] {
  return [
    {
      accessorKey: "classificacao",
      header: "Classificação",
      cell: ({ row }) => {        
        return (
          <div className="max-w-[400px] truncate" title={row.getValue("classificacao") as string}>
            {row.getValue("classificacao") as string}
          </div>
        )
      },
    },
    {
      accessorKey: "descricao",
      header: "Descrição",
      cell: ({ row }) => {
        const descricao = row.getValue("descricao") as string
        return (
          <div className="max-w-[400px] truncate" title={descricao}>
            {descricao}
          </div>
        )
      },
    },
    {
      accessorKey: "politica.nome",
      header: "Política",
      cell: ({ row }) => {
        if (!row.original.politicaId) {
          return <span className="text-muted-foreground">-</span>
        }
        
        return (
          <div className="max-w-[400px] truncate" title={row.original.politica.nome}>
            {row.original.politica.nome}
          </div>
        )
      },
    },
    {
      accessorKey: "createdAt",
      header: "Criado em",
      cell: ({ row }) => {
        const createdAt = row.getValue("createdAt") as string
        return (
          <span className="text-muted-foreground">
            {new Date(createdAt).toLocaleDateString('pt-BR')}
          </span>
        )
      },
    },
    {
      id: "actions",
      header: () => <div className="text-center">Ações</div>,
      cell: ({ row }) => {
        const referencial = row.original
        return (
          <ColumnActions
            onEdit={() => onEdit(referencial)}
            onDelete={() => onDelete(referencial.id)}
          />
        )
      },
      size: 70,
    },
  ]
}
