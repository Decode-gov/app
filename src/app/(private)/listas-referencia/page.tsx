"use client"

import { useState, useMemo } from "react"
import { Plus, List, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { useListasReferencia, useDeleteListaReferencia } from "@/hooks/api/use-listas-referencia"
import { useDefinicoes } from "@/hooks/api/use-definicoes"
import { useTabelas } from "@/hooks/api/use-tabelas"
import { ListaForm } from "@/components/listas-referencia/lista-form"
import type { ListaReferenciaResponse } from "@/types/api"

export default function ListasReferenciaPage() {
  const [formOpen, setFormOpen] = useState(false)
  const [selectedLista, setSelectedLista] = useState<ListaReferenciaResponse | undefined>()
  const [search, setSearch] = useState("")
  const [termoFilter, setTermoFilter] = useState<string>("all")

  // Queries
  const { data, isLoading } = useListasReferencia({ page: 1, limit: 1000 })
  const { data: termosData } = useDefinicoes({ page: 1, limit: 1000 })
  const { data: tabelasData } = useTabelas({ page: 1, limit: 1000 })
  const { mutate: deleteLista } = useDeleteListaReferencia()

  const listas = data?.data ?? []
  const termos = termosData?.data ?? []
  const tabelas = tabelasData?.data ?? []

  // Helper para encontrar termo
  const getTermoNome = (termoId: string) => {
    const termo = termos.find((t) => t.id === termoId)
    return termo?.termo ?? "N/A"
  }

  // Helper para encontrar tabela
  const getTabelaNome = (tabelaId?: string) => {
    if (!tabelaId) return null
    const tabela = tabelas.find((t) => t.id === tabelaId)
    return tabela?.nome
  }

  // Stats
  const stats = useMemo(() => {
    return {
      total: listas.length,
      comTabela: listas.filter((l) => l.tabelaId).length,
      comColuna: listas.filter((l) => l.colunaId).length,
      termosUnicos: new Set(listas.map((l) => l.termoId)).size,
    }
  }, [listas])

  // Filtros
  const filteredListas = useMemo(() => {
    return listas.filter((lista) => {
      const matchesSearch =
        search === "" ||
        lista.nome.toLowerCase().includes(search.toLowerCase()) ||
        lista.descricao.toLowerCase().includes(search.toLowerCase())

      const matchesTermo = termoFilter === "all" || lista.termoId === termoFilter

      return matchesSearch && matchesTermo
    })
  }, [listas, search, termoFilter])

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
            Gerencie listas de referência e suas associações com termos de negócio
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Lista
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
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
            <CardTitle className="text-sm font-medium">Com Tabela</CardTitle>
            <List className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.comTabela}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Com Coluna</CardTitle>
            <List className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.comColuna}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Termos Únicos</CardTitle>
            <List className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.termosUnicos}</div>
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
        <Select value={termoFilter} onValueChange={setTermoFilter}>
          <SelectTrigger className="w-full md:w-[250px]">
            <SelectValue placeholder="Filtrar por termo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os termos</SelectItem>
            {termos.map((termo) => (
              <SelectItem key={termo.id} value={termo.id}>
                {termo.termo}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Termo</TableHead>
              <TableHead>Tabela</TableHead>
              <TableHead>Coluna</TableHead>
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
                    <Skeleton className="h-5 w-[100px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-[100px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-[100px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-8" />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredListas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Nenhuma lista de referência encontrada
                </TableCell>
              </TableRow>
            ) : (
              filteredListas.map((lista) => (
                <TableRow key={lista.id}>
                  <TableCell className="font-medium">{lista.nome}</TableCell>
                  <TableCell className="max-w-[300px] truncate">{lista.descricao}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{getTermoNome(lista.termoId)}</Badge>
                  </TableCell>
                  <TableCell>
                    {lista.tabelaId ? (
                      <Badge variant="outline">{getTabelaNome(lista.tabelaId) ?? "N/A"}</Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {lista.colunaId ? (
                      <Badge variant="outline">Vinculada</Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
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
