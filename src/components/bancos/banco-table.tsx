"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Pencil, Trash2, ArrowUpDown } from "lucide-react"
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
import { BancoResponse } from "@/types/api"
import { Badge } from "@/components/ui/badge"

interface BancoTableProps {
  data: BancoResponse[]
  onEdit: (banco: BancoResponse) => void
  onDelete: (id: string) => void
}

export function BancoTable({ data, onEdit, onDelete }: BancoTableProps) {
  const columns: ColumnDef<BancoResponse>[] = [
    {
      accessorKey: "nome",
      header: 'Nome',
      cell: ({ row }) => <div className="font-medium">{row.getValue("nome")}</div>,
    },
    {
      accessorKey: "sistema",
      header: "Sistema",
      cell: ({ row }) => {
        const sistema = row.original.sistema
        return (
          <div className="text-sm">
            {sistema ? sistema.nome : <span className="text-muted-foreground">-</span>}
          </div>
        )
      },
    },
    {
      id: "tabelas",
      header: "Tabelas",
      cell: ({ row }) => {
        const count = row.original._count?.tabelas || row.original.tabelas?.length || 0
        if (count === 0) {
          return <span className="text-sm text-muted-foreground">0</span>
        }
        return <Badge variant="secondary">{count}</Badge>
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const banco = row.original

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
              <DropdownMenuItem onClick={() => onEdit(banco)}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(banco.id)}
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
      searchPlaceholder="Buscar bancos de dados..."
    />
  )
}
