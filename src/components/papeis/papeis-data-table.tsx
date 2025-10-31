"use client"

import { useState } from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  politicaOptions: { id: string; nome: string }[]
}

export function PapeisDataTable<TData, TValue>({
  columns,
  data,
  politicaOptions,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [politicaFilter, setPoliticaFilter] = useState<string>("")

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  })

  // Filtro customizado para política
  const filteredData = politicaFilter
    ? data.filter((item) => {
        const papel = item as { politicaId: string }
        return papel.politicaId === politicaFilter
      })
    : data

  // Atualizar tabela com dados filtrados
  const filteredTable = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  })

  const activeTable = politicaFilter ? filteredTable : table

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar papéis..."
            value={(activeTable.getColumn("nome")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              activeTable.getColumn("nome")?.setFilterValue(event.target.value)
            }
            className="pl-8"
          />
        </div>
        <Select
          value={politicaFilter || "ALL"}
          onValueChange={(value) => {
            setPoliticaFilter(value === "ALL" ? "" : value)
            // Limpar filtro de nome ao mudar política
            activeTable.getColumn("nome")?.setFilterValue("")
          }}
        >
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Filtrar por política" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todas as políticas</SelectItem>
            {politicaOptions.map((politica) => (
              <SelectItem key={politica.id} value={politica.id}>
                {politica.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {activeTable.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
            {activeTable.getRowModel().rows?.length ? (
              activeTable.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
                  Nenhum papel encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
