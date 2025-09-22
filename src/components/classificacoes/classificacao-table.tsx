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
import { ArrowUpDown, ChevronDown, Edit, MoreHorizontal, Trash2 } from "lucide-react"
import { Classificacao } from "@/types/classificacao"

interface ClassificacaoTableProps {
  data: Classificacao[]
  onEdit: (classificacao: Classificacao) => void
  onDelete: (classificacao: Classificacao) => void
}

// Mock data para mapear IDs para nomes
const mockPoliticas: Record<string, string> = {
  "1": "Política de Segurança da Informação",
  "2": "Política de Privacidade de Dados", 
  "3": "Política de Retenção de Documentos",
  "4": "Política de Classificação de Informações",
}

const mockTermos: Record<string, string> = {
  "1": "Dados Pessoais",
  "2": "Dados Sensíveis",
  "3": "Informação Confidencial",
  "4": "Documento Público",
}

export function ClassificacaoTable({ data, onEdit, onDelete }: ClassificacaoTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const columns: ColumnDef<Classificacao>[] = [
      {
        accessorKey: "nome",
        header: "Nome",
        cell: ({ row }) => (
          <div className="font-medium text-foreground">{row.getValue("nome")}</div>
        ),
      },
      {
        accessorKey: "descricao",
        header: "Descrição",
        cell: ({ row }) => (
          <div className="max-w-md truncate text-muted-foreground">
            {row.getValue("descricao") || "Sem descrição"}
          </div>
        ),
      },
      {
        accessorKey: "politicaId",
        header: "Política",
        cell: ({ row }) => {
          const politicaId = row.getValue("politicaId") as string
          const politicaNome = mockPoliticas[politicaId] || "Política não encontrada"
          return (
            <Badge variant="secondary" className="whitespace-nowrap">
              {politicaNome}
            </Badge>
          )
        },
      },
      {
        accessorKey: "termoId",
        header: "Termo",
        cell: ({ row }) => {
          const termoId = row.getValue("termoId") as string
          if (!termoId) {
            return <span className="text-muted-foreground text-sm">Nenhum termo</span>
          }
          const termoNome = mockTermos[termoId] || "Termo não encontrado"
          return (
            <Badge variant="outline" className="whitespace-nowrap">
              {termoNome}
            </Badge>
          )
        },
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const classificacao = row.original
  
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
                  onClick={() => onEdit(classificacao)}
                  className="hover:bg-accent/50 focus:bg-accent/50"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(classificacao)}
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
                  Nenhuma classificação encontrada.
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
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium text-foreground">Linhas por página</p>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value))
              }}
              className="h-8 w-[70px] rounded border border-border/60 bg-background px-2 text-sm"
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium text-foreground">
            Página {table.getState().pagination.pageIndex + 1} de{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex bg-background/50 border-border/60 hover:bg-accent/50"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Ir para primeira página</span>
              <ChevronDown className="h-4 w-4 rotate-90" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0 bg-background/50 border-border/60 hover:bg-accent/50"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Ir para página anterior</span>
              <ChevronDown className="h-4 w-4 rotate-90" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0 bg-background/50 border-border/60 hover:bg-accent/50"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Ir para próxima página</span>
              <ChevronDown className="h-4 w-4 -rotate-90" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex bg-background/50 border-border/60 hover:bg-accent/50"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Ir para última página</span>
              <ChevronDown className="h-4 w-4 -rotate-90" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
