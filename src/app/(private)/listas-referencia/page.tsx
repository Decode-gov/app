"use client"

import { useState, useMemo } from "react"
import { Plus, List, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { useListasReferencia, useDeleteListaReferencia } from "@/hooks/api/use-listas-referencia"
import { ListaForm } from "@/components/listas-referencia/lista-form"
import type { ListaReferenciaResponse } from "@/types/api"

export default function ListasReferenciaPage() {
  const [formOpen, setFormOpen] = useState(false)
  const [selectedLista, setSelectedLista] = useState<ListaReferenciaResponse | undefined>()
  const [search, setSearch] = useState("")

  // Queries
  const { data, isLoading } = useListasReferencia({ page: 1, limit: 1000 })
  const { mutate: deleteLista } = useDeleteListaReferencia()

  const listas = useMemo(() => data?.data ?? [], [data?.data])

  // Stats
  const stats = useMemo(() => {
    return {
      total: listas.length,
      comDescricao: listas.filter((l) => l.descricao && l.descricao.trim() !== "").length,
    }
  }, [listas])

  // Filtros
  const filteredListas = useMemo(() => {
    return listas.filter((lista) => {
      const matchesSearch =
        search === "" ||
        lista.nome.toLowerCase().includes(search.toLowerCase()) ||
        (lista.descricao && lista.descricao.toLowerCase().includes(search.toLowerCase()))

      return matchesSearch
    })
  }, [listas, search])

  const handleEdit = (lista: ListaReferenciaResponse) => {
    setSelectedLista(lista)
    setFormOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta lista de referência?")) {
      deleteLista(id)
    }
  }

  const handleCloseForm = () => {
    setFormOpen(false)
    setSelectedLista(undefined)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Listas de Referência</h1>
          <p className="text-muted-foreground">
            Gerencie listas de referência do sistema
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Lista
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Listas</CardTitle>
            <List className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Com Descrição</CardTitle>
            <List className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.comDescricao}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou descrição..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-[200px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[300px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-8" />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredListas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  Nenhuma lista de referência encontrada
                </TableCell>
              </TableRow>
            ) : (
              filteredListas.map((lista) => (
                <TableRow key={lista.id}>
                  <TableCell className="font-medium">{lista.nome}</TableCell>
                  <TableCell className="max-w-[300px] truncate">
                    {lista.descricao || (
                      <span className="text-muted-foreground italic">Sem descrição</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(lista)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(lista.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Form Dialog */}
      <ListaForm open={formOpen} onOpenChange={handleCloseForm} lista={selectedLista} />
    </div>
  )
}
