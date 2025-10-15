"use client"

import { useState } from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronLeft, ChevronRight, Pencil, MoreHorizontal, Trash2 } from "lucide-react"
import { type Papel } from "@/types/papel"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface PapelTableProps {
  data: Papel[]
  onEdit: (papel: Papel) => void
  onDelete: (papel: Papel) => void
}

// Mock data das políticas para display
const mockPoliticasMap = {
  "550e8400-e29b-41d4-a716-446655440001": "Política de Segurança da Informação",
  "550e8400-e29b-41d4-a716-446655440002": "Política de Privacidade de Dados",
  "550e8400-e29b-41d4-a716-446655440003": "Política de Retenção de Documentos",
  "550e8400-e29b-41d4-a716-446655440004": "Política de Classificação de Informações",
}

export function PapelTable({ data, onEdit, onDelete }: PapelTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const getPoliticaNome = (politicaId: string): string => {
    return mockPoliticasMap[politicaId as keyof typeof mockPoliticasMap] || `Política ${politicaId.slice(0, 8)}...`
  }

  const columns: ColumnDef<Papel>[] = [
    {
      accessorKey: "nome",
      header: "Nome",
      cell: ({ row }) => (
        <div className="font-medium text-foreground">
          <div className="font-semibold">{row.getValue("nome")}</div>
        </div>
      ),
    },
    {
      accessorKey: "descricao",
      header: "Descrição",
      cell: ({ row }) => (
        <div className="max-w-md truncate text-muted-foreground" title={row.getValue("descricao")}>
          {row.getValue("descricao") || "Sem descrição"}
        </div>
      ),
    },
    {
      accessorKey: "politicaId",
      header: "Política",
      cell: ({ row }) => {
        const politicaId = row.getValue("politicaId") as string
        const politicaNome = getPoliticaNome(politicaId)
        return (
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 whitespace-nowrap">
            {politicaNome}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const papel = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="h-8 w-8 p-0 hover:bg-accent/50" 
                size="sm"
              >
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background/95 backdrop-blur-sm border-border/60">
              <DropdownMenuItem 
                onClick={() => onEdit(papel)}
                className="hover:bg-accent/50 focus:bg-accent/50"
              >
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(papel)}
                className="text-destructive hover:bg-destructive/10 focus:bg-destructive/10 hover:text-destructive focus:text-destructive"
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

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border/60 bg-card/50 backdrop-blur-sm shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-border/60 hover:bg-muted/50">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-foreground font-semibold">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-border/60 hover:bg-muted/20 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell 
                  colSpan={columns.length} 
                  className="h-24 text-center text-muted-foreground"
                >
                  Nenhum papel encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <>
              {table.getFilteredSelectedRowModel().rows.length} de{" "}
              {table.getFilteredRowModel().rows.length} linha(s) selecionada(s).
            </>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="bg-background/50 backdrop-blur-sm border-border/60 hover:bg-accent/50"
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="bg-background/50 backdrop-blur-sm border-border/60 hover:bg-accent/50"
          >
            Próximo
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}