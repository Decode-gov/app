"use client"

import { useState } from "react"
import { Plus, Search, MoreHorizontal, Edit, Trash2, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useDefinicoes, useDeleteDefinicao } from "@/hooks/api/use-definicoes"
import { TermoForm } from "@/components/termos/termo-form"
import { DefinicaoResponse } from "@/types/api"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function TermosNegocioPage() {
  const [formOpen, setFormOpen] = useState(false)
  const [selectedTermo, setSelectedTermo] = useState<DefinicaoResponse | undefined>()
  const [search, setSearch] = useState("")
  const [ativoFilter, setAtivoFilter] = useState<string>("all")

  const { data: termosData, isLoading, error } = useDefinicoes()
  const { mutate: deleteTermo } = useDeleteDefinicao()

  const termos = termosData?.data || []

  const filteredTermos = termos.filter((termo) => {
    const matchesSearch = 
      search === "" ||
      termo.termo.toLowerCase().includes(search.toLowerCase()) ||
      termo.definicao?.toLowerCase().includes(search.toLowerCase())
    
    const matchesAtivo = ativoFilter === "all" || 
      (ativoFilter === "ativo" && termo.ativo) ||
      (ativoFilter === "inativo" && !termo.ativo)
    
    return matchesSearch && matchesAtivo
  })

  const handleEdit = (termo: DefinicaoResponse) => {
    setSelectedTermo(termo)
    setFormOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este termo?")) {
      deleteTermo(id)
    }
  }

  const handleNewTermo = () => {
    setSelectedTermo(undefined)
    setFormOpen(true)
  }

  const handleCloseForm = () => {
    setFormOpen(false)
    setSelectedTermo(undefined)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Termos de Negócio
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie o glossário de termos do sistema
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[60px] mb-2" />
                <Skeleton className="h-3 w-[120px]" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-[300px]" />
              <Skeleton className="h-10 w-[100px]" />
            </div>
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-destructive">
            Termos de Negócio
          </h1>
          <p className="text-muted-foreground mt-2">
            Erro ao carregar termos de negócio
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Termos de Negócio
        </h1>
        <p className="text-muted-foreground mt-2">
          Gerencie o glossário de termos e definições do sistema DECODE-GOV
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Termos</CardTitle>
            <div className="p-2 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors duration-300">
              <BookOpen className="h-4 w-4 text-blue-600 transition-colors duration-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{termos.length}</div>
            <p className="text-xs text-muted-foreground">termos cadastrados</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Termos Ativos</CardTitle>
            <div className="p-2 rounded-lg bg-green-100 group-hover:bg-green-200 transition-colors duration-300">
              <BookOpen className="h-4 w-4 text-green-600 transition-colors duration-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{termos.filter(t => t.ativo).length}</div>
            <p className="text-xs text-muted-foreground">termos ativos</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Termos Inativos</CardTitle>
            <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-gray-200 transition-colors duration-300">
              <BookOpen className="h-4 w-4 text-gray-600 transition-colors duration-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{termos.filter(t => !t.ativo).length}</div>
            <p className="text-xs text-muted-foreground">termos inativos</p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Termos de Negócio</CardTitle>
            </div>
            <Button className="gap-2" onClick={handleNewTermo}>
              <Plus className="h-4 w-4" />
              Novo Termo
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por termo ou definição..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={ativoFilter} onValueChange={setAtivoFilter}>
              <SelectTrigger className="w-full md:w-[250px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="ativo">Ativos</SelectItem>
                <SelectItem value="inativo">Inativos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Termo</TableHead>
                  <TableHead>Definição</TableHead>
                  <TableHead>Sigla</TableHead>
                  <TableHead>Criado em</TableHead>
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
                        <Skeleton className="h-5 w-[80px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[100px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-8 w-8" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredTermos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      Nenhum termo encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTermos.map((termo) => (
                    <TableRow key={termo.id}>
                      <TableCell className="font-medium">{termo.termo}</TableCell>
                      <TableCell className="max-w-[400px] truncate">
                        {termo.definicao || '-'}
                      </TableCell>
                      <TableCell>
                        {termo.sigla ? (
                          <Badge variant="outline">{termo.sigla}</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(termo.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(termo)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDelete(termo.id)}
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
      <TermoForm open={formOpen} onOpenChange={handleCloseForm} termo={selectedTermo} />
    </div>
  )
}
