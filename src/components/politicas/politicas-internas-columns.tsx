"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { PoliticaInternaResponse } from "@/types/api"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"

interface ColumnsProps {
  onEdit: (politica: PoliticaInternaResponse) => void
  onDelete: (id: string) => void
  onView?: (politica: PoliticaInternaResponse) => void
}

const statusBadgeMap: Record<PoliticaInternaResponse['status'], { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
  Vigente: { variant: "default", label: "Ativa" },
  Revogada: { variant: "destructive", label: "Revogada" },
  Em_elaboracao: { variant: "outline", label: "Em Revisão" },
}

const escopoLabels: Record<string, string> = {
  SEGURANCA: "Segurança",
  QUALIDADE: "Qualidade",
  GOVERNANCA: "Governança",
  OUTRO: "Outro",
}

export const createColumns = ({
  onEdit,
  onDelete,
  onView,
}: ColumnsProps): ColumnDef<PoliticaInternaResponse>[] => [
    {
      accessorKey: "nome",
      header: "Nome",
      cell: ({ row }) => {
        const politica = row.original
        return (
          <div className="max-w-[200px]">
            <div className="font-medium truncate" title={politica.nome}>
              {politica.nome}
            </div>
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
          <div className="max-w-[250px] truncate text-muted-foreground" title={descricao || ''}>
            {descricao || '-'}
          </div>
        )
      },
    },
    {
      accessorKey: "escopo",
      header: "Escopo",
      cell: ({ row }) => {
        const escopo = row.getValue("escopo") as string
        return (
          <Tooltip>
            <TooltipTrigger>
              <Badge variant="outline" className="flex justify-start max-w-[250px] truncate">
                {escopoLabels[escopo] || escopo}
              </Badge>
            </TooltipTrigger>
            <TooltipContent className="max-w-screen flex-wrap">
              {escopoLabels[escopo] || escopo}
            </TooltipContent>
          </Tooltip>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as PoliticaInternaResponse['status']
        const badgeInfo = statusBadgeMap[status]

        return (
          <Badge variant={badgeInfo?.variant || 'outline'}>
            {badgeInfo?.label || status}
          </Badge>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: "dataInicioVigencia",
      header: "Início da Vigência",
      cell: ({ row }) => {
        const data = row.getValue("dataInicioVigencia") as Date
        return (
          <div className="text-muted-foreground">
            {new Date(data).toLocaleDateString('pt-BR')}
          </div>
        )
      },
    },
    {
      accessorKey: "dataTermino",
      header: "Término",
      cell: ({ row }) => {
        const data = row.getValue("dataTermino") as Date | undefined
        return (
          <div className="text-muted-foreground">
            {data ? new Date(data).toLocaleDateString('pt-BR') : '—'}
          </div>
        )
      },
    },
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }) => {
        const politica = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onView && (
                <DropdownMenuItem onClick={() => onView(politica)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Ver detalhes
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => onEdit(politica)}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => onDelete(politica.id)}
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
