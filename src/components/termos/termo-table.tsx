import { useState, useMemo } from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
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
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronLeft, ChevronRight, MoreHorizontal, Edit, Trash2, BookOpen, Filter } from "lucide-react"
import { type Termo } from "@/types/termo"

interface TermoTableProps {
  data: Termo[]
  searchTerm: string
  selectedStatus: string | null
  onEdit: (termo: Termo) => void
  onDelete: (termo: Termo) => void
}

export function TermoTable({ data, searchTerm, selectedStatus, onEdit, onDelete }: TermoTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])

  const columns: ColumnDef<Termo>[] = useMemo(() => [
    {
      accessorKey: "nome",
      header: "Definição",
    },
    {
      accessorKey: "descricao",
      header: "Categorização",
      cell: ({ row }) => {
        const descricao = row.getValue("descricao") as string
        return (
          <div className="max-w-[300px] truncate" title={descricao}>
            {descricao}
          </div>
        )
      },
    },
    {
      accessorKey: "sigla",
      header: "Sigla",
      cell: ({ row }) => {
        const sigla = row.getValue("sigla") as string | null
        return sigla ? (
          <Badge variant="outline" className="font-mono">
            {sigla}
          </Badge>
        ) : (
          <span className="text-muted-foreground">-</span>
        )
      },
    },
    {
      accessorKey: "ativo",
      header: "Status",
      cell: ({ row }) => {
        const ativo = row.getValue("ativo") as boolean
        return (
          <Badge variant={ativo ? "default" : "secondary"}>
            {ativo ? "Ativo" : "Inativo"}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const termo = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background/80 backdrop-blur-sm border-border/60">
              <DropdownMenuItem
                onClick={() => onEdit(termo)}
                className="cursor-pointer hover:bg-accent/50"
              >
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(termo)}
                className="cursor-pointer text-destructive focus:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ], [onEdit, onDelete])

  // Filtrar dados baseado no termo de busca e status selecionado
  const filteredData = useMemo(() => {
    return data.filter((termo) => {
      const matchesSearch = !searchTerm || 
        termo.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        termo.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (termo.sigla && termo.sigla.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesStatus = !selectedStatus || 
        selectedStatus === "todos" || 
        termo.ativo.toString() === selectedStatus
      
      return matchesSearch && matchesStatus
    })
  }, [data, searchTerm, selectedStatus])

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  return (
    <div className="space-y-4">
      {/* Indicador de filtros ativos */}
      <div className="flex items-center justify-between p-4 bg-card/50 backdrop-blur-sm rounded-lg border border-border/40 transition-all duration-200">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Filtros aplicados:</span>
          </div>
          <div className="flex items-center gap-2">
            {searchTerm && (
              <Badge variant="secondary" className="bg-primary/10 text-primary animate-fade-in">
                Busca: &ldquo;{searchTerm}&rdquo;
              </Badge>
            )}
            {selectedStatus && selectedStatus !== "todos" && (
              <Badge variant="secondary" className="bg-primary/10 text-primary animate-fade-in">
                Status: {selectedStatus === "true" ? "Ativos" : "Inativos"}
              </Badge>
            )}
            {!searchTerm && (!selectedStatus || selectedStatus === "todos") && (
              <span className="text-sm text-muted-foreground animate-fade-in">Nenhum filtro ativo</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">
            <span className="text-primary font-semibold">{filteredData.length}</span> de {data.length} termos
          </span>
        </div>
      </div>

      <div className="rounded-md border border-border/60 bg-card/30 backdrop-blur-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-border/40 hover:bg-muted/30">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-foreground/80 font-semibold">
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
                  className="border-border/40 hover:bg-muted/30 transition-colors duration-200"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-foreground/90">
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
                  {searchTerm || selectedStatus ? (
                    <div className="flex flex-col items-center gap-2">
                      <span>Nenhum termo encontrado com os filtros aplicados.</span>
                      <span className="text-xs">Tente ajustar ou limpar os filtros.</span>
                    </div>
                  ) : (
                    "Nenhum termo encontrado."
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium text-muted-foreground">
            Mostrando {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} a{" "}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}{" "}
            de {table.getFilteredRowModel().rows.length} resultado(s)
          </p>
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
