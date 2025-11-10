"use client"

import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchPlaceholder?: string
  filters?: Array<{
    column: string
    label: string
    options: Array<{ label: string; value: string }>
  }>
}

export function AtribuicoesTable<TData, TValue>({
  columns,
  data,
  searchPlaceholder = "Buscar...",
  filters = [],
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState("")

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row) => {
      const searchValue = globalFilter.toLowerCase()
      
      // Busca nos campos principais
      const original = row.original as Record<string, unknown>
      const papel = ((original?.papel as Record<string, unknown>)?.nome as string)?.toLowerCase() || ""
      const dominio = ((original?.dominio as Record<string, unknown>)?.nome as string)?.toLowerCase() || ""
      const responsavel = (original?.responsavel as string)?.toLowerCase() || ""
      
      return (
        papel.includes(searchValue) ||
        dominio.includes(searchValue) ||
        responsavel.includes(searchValue)
      )
    },
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  const hasFilters = globalFilter !== "" || columnFilters.length > 0

  const clearFilters = () => {
    setGlobalFilter("")
    setColumnFilters([])
  }

  return (
    <div className="space-y-4">
      {/* Barra de Filtros */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Busca Global */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-8"
          />
        </div>

        {/* Filtros por Coluna */}
        {filters.map((filter) => (
          <Select
            key={filter.column}
            value={(columnFilters.find((f) => f.id === filter.column)?.value as string) || "all"}
            onValueChange={(value) => {
              if (value === "all") {
                setColumnFilters((prev) => prev.filter((f) => f.id !== filter.column))
              } else {
                setColumnFilters((prev) => {
                  const existing = prev.find((f) => f.id === filter.column)
                  if (existing) {
                    return prev.map((f) => (f.id === filter.column ? { ...f, value } : f))
                  }
                  return [...prev, { id: filter.column, value }]
                })
              }
            }}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder={filter.label} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {filter.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}

        {/* Botão Limpar Filtros */}
        {hasFilters && (
          <Button variant="outline" size="sm" onClick={clearFilters} className="gap-2">
            <X className="h-4 w-4" />
            Limpar Filtros
          </Button>
        )}
      </div>

      {/* Tabela */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="text-muted-foreground">
                    {hasFilters ? "Nenhum resultado encontrado" : "Nenhuma atribuição encontrada"}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginação */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length > 0 ? (
            <>
              Mostrando{" "}
              <span className="font-medium">
                {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
              </span>{" "}
              até{" "}
              <span className="font-medium">
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                  table.getFilteredRowModel().rows.length
                )}
              </span>{" "}
              de <span className="font-medium">{table.getFilteredRowModel().rows.length}</span>{" "}
              resultado(s)
            </>
          ) : (
            "Nenhum resultado para exibir"
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>
          <div className="text-sm text-muted-foreground">
            Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Próxima
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
