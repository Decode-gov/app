"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Edit, MoreHorizontal, Trash2 } from "lucide-react"
import { AtribuicaoResponse } from "@/types/api"

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
  onEdit: (atribuicao: AtribuicaoResponse) => void
  onDelete: (id: string) => void
}

export function getAtribuicoesColumns({
  onEdit,
  onDelete,
}: GetColumnsParams): ColumnDef<AtribuicaoResponse>[] {
  return [
    {
      accessorKey: "papel.nome",
      header: "Papel",
      cell: ({ row }) => {
        const nome = row.original.papel.nome
        return (
          <div className="font-medium">
            <div className="max-w-[200px] truncate" title={nome}>
              {nome}
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "dominio.nome",
      header: "Domínio",
      cell: ({ row }) => {
        const nome = row.original.dominio.nome
        return (
          <div className="max-w-[200px] truncate" title={nome}>
            {nome}
          </div>
        )
      },
    },
    {
      accessorKey: "responsavel",
      header: "Responsável",
      cell: ({ row }) => {
        const responsavel = row.getValue("responsavel") as string
        return (
          <div className="max-w-[200px] truncate" title={responsavel}>
            {responsavel}
          </div>
        )
      },
    },
    {
      accessorKey: "comiteAprovador",
      header: "Comitê Aprovador",
      cell: ({ row }) => {
        const comite = row.original.comiteAprovador
        return (
          <div className="text-muted-foreground">
            {comite?.nome || row.original.comiteAprovadorId || "—"}
          </div>
        )
      },
    },
    {
      accessorKey: "onboarding",
      header: "Onboarding",
      cell: ({ row }) => {
        const onboarding = row.getValue("onboarding") as boolean
        return (
          <div className="text-center">
            {onboarding ? (
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                Sim
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
                Não
              </span>
            )}
          </div>
        )
      },
    },
    {
      id: "actions",
      header: () => <div className="text-center">Ações</div>,
      cell: ({ row }) => {
        const atribuicao = row.original
        return (
          <ColumnActions
            onEdit={() => onEdit(atribuicao)}
            onDelete={() => onDelete(atribuicao.id)}
          />
        )
      },
      size: 70,
    },
  ]
}
