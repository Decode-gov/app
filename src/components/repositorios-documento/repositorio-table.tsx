"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Pencil, Trash2, ArrowUpDown, FolderGit2, Network } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTable } from "@/components/ui/data-table"
import { RepositorioDocumentoResponse } from "@/types/api"
import { Badge } from "@/components/ui/badge"

interface RepositorioTableProps {
  data: RepositorioDocumentoResponse[]
  onEdit: (repositorio: RepositorioDocumentoResponse) => void
  onDelete: (id: string) => void
}

export function RepositorioTable({ data, onEdit, onDelete }: RepositorioTableProps) {
  const columns: ColumnDef<RepositorioDocumentoResponse>[] = [
    {
      accessorKey: "nome",
      header: 'Nome do Repositório',
      cell: ({ row }) => <div className="font-medium">{row.getValue("nome")}</div>,
    },
    {
      accessorKey: "ged",
      header: "GED",
      cell: ({ row }) => {
        const ged = row.getValue("ged") as boolean
        return (
          <span className="text-sm text-muted-foreground">{ged ? "Sim" : "Não"}</span>
        )
      },
    },
    {
      accessorKey: "rede",
      header: "Rede",
      cell: ({ row }) => {
        const rede = row.getValue("rede") as boolean
        return (<span className="text-sm text-muted-foreground">{rede ? "Sim" : "Não"}</span>
        )
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const repositorio = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEdit(repositorio)}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(repositorio.id)}
                className="text-red-600"
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

  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey="nome"
      searchPlaceholder="Buscar repositórios..."
    />
  )
}
