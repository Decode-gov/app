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
import { type Politica } from "@/types/politica"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface PoliticaTableProps {
  data: Politica[]
  onEdit: (politica: Politica) => void
  onDelete: (politica: Politica) => void
}

export function PoliticaTable({ data, onEdit, onDelete }: PoliticaTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Vigente":
        return (
          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 whitespace-nowrap">
            Vigente
          </Badge>
        )
      case "Em_elaboracao":
        return (
          <Badge variant="outline" className="border-yellow-300 text-yellow-700 whitespace-nowrap">
            Em Elaboração
          </Badge>
        )
      case "Revogada":
        return (
          <Badge variant="secondary" className="whitespace-nowrap">
            Revogada
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="whitespace-nowrap">
            {status}
          </Badge>
        )
    }
  }

  const columns: ColumnDef<Politica>[] = [
    {
      accessorKey: "nome",
      header: "Nome",
      cell: ({ row }) => (
        <div className=" flex items-center gap-2 font-medium text-foreground">
          <div className="font-semibold">{row.getValue("nome")}</div>
          <Badge className="text-xs">
            v{row.original.versao}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "categoria",
      header: "Categoria",
      cell: ({ row }) => (
        <Badge variant="secondary" className="whitespace-nowrap">
          {row.getValue("categoria")}
        </Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.getValue("status")),
    },
    {
      accessorKey: "responsavel",
      header: "Responsável",
      cell: ({ row }) => (
        <div className="text-muted-foreground">
          {row.getValue("responsavel")}
        </div>
      ),
    },
    {
      accessorKey: "dataInicioVigencia",
      header: "Vigência",
      cell: ({ row }) => {
        const dataInicioVigencia = row.getValue("dataInicioVigencia") as Date
        return (
          <div className="text-muted-foreground">
            <div className="text-sm">
              {format(dataInicioVigencia, "dd/MM/yyyy", { locale: ptBR })}
            </div>
          </div>
        )
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const politica = row.original

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
                onClick={() => onEdit(politica)}
                className="hover:bg-accent/50 focus:bg-accent/50"
              >
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(politica)}
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
                  Nenhuma política encontrada.
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