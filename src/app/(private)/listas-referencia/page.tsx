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
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Listas de Referência
        </h1>
        <p className="text-muted-foreground mt-2">
          Gerencie listas de referência do sistema DECODE-GOV
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Listas</CardTitle>
            <div className="p-2 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors duration-300">
              <List className="h-4 w-4 text-blue-600 transition-colors duration-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <p className="text-xs text-muted-foreground">listas cadastradas</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Com Descrição</CardTitle>
            <div className="p-2 rounded-lg bg-green-100 group-hover:bg-green-200 transition-colors duration-300">
              <List className="h-4 w-4 text-green-600 transition-colors duration-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.comDescricao}</div>
            <p className="text-xs text-muted-foreground">com descrição</p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Listas de Referência</CardTitle>
            </div>
            <Button className="gap-2" onClick={() => setFormOpen(true)}>
              <Plus className="h-4 w-4" />
              Nova Lista
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou descrição..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead className="w-[70px]">Ações</TableHead>
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
          </div>
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <ListaForm open={formOpen} onOpenChange={handleCloseForm} lista={selectedLista} />
    </div>
  )
}
