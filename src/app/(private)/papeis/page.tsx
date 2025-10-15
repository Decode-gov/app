"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Search, MoreHorizontal, Eye, Edit, Trash2, UserCheck } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { usePapeis, useDeletePapel } from "@/hooks/api/use-papeis"
import { usePoliticasInternas } from "@/hooks/api/use-politicas-internas"
import { PapelGovernancaForm } from "@/components/papeis/papel-governanca-form"
import { PapelResponse } from "@/types/api"

export default function PapeisPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [politicaFilter, setPoliticaFilter] = useState<string>("")
  const [formOpen, setFormOpen] = useState(false)
  const [selectedPapel, setSelectedPapel] = useState<PapelResponse | undefined>()

  const { data: papeisData, isLoading, error } = usePapeis()
  const { data: politicasData } = usePoliticasInternas()
  const deletePapel = useDeletePapel()

  // Extração dos arrays de dados
  const papeis = papeisData?.data ?? []
  const politicas = politicasData?.data ?? []

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este papel?")) {
      await deletePapel.mutateAsync(id)
    }
  }

  // Filtrar dados localmente
  const filteredData = papeis.filter((papel) => {
    const matchesSearch = papel.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          papel.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPolitica = !politicaFilter || papel.politicaId === politicaFilter
    return matchesSearch && matchesPolitica
  })

  // Obter nome da política
  const getPoliticaNome = (politicaId: string) => {
    const politica = politicas.find(p => p.id === politicaId)
    return politica?.nome || "Política não encontrada"
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Papéis
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie os papéis de governança do sistema DECODE-GOV
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-20" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-[400px] w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Papéis
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie os papéis de governança do sistema DECODE-GOV
          </p>
        </div>
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">
              Erro ao carregar dados. Tente novamente.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Papéis
        </h1>
        <p className="text-muted-foreground mt-2">
          Gerencie os papéis de governança do sistema DECODE-GOV
        </p>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <div className="p-2 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors duration-300">
              <UserCheck className="h-4 w-4 text-accent group-hover:text-accent-foreground transition-colors duration-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{papeisData?.total || 0}</div>
            <p className="text-xs text-muted-foreground">papéis cadastrados</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Com Política</CardTitle>
            <div className="p-2 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors duration-300">
              <UserCheck className="h-4 w-4 text-blue-600 transition-colors duration-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {papeis.filter(p => p.politicaId).length}
            </div>
            <p className="text-xs text-muted-foreground">com política definida</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sem Política</CardTitle>
            <div className="p-2 rounded-lg bg-orange-100 group-hover:bg-orange-200 transition-colors duration-300">
              <UserCheck className="h-4 w-4 text-orange-600 transition-colors duration-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {papeis.filter(p => !p.politicaId).length}
            </div>
            <p className="text-xs text-muted-foreground">sem política definida</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativos</CardTitle>
            <div className="p-2 rounded-lg bg-green-100 group-hover:bg-green-200 transition-colors duration-300">
              <UserCheck className="h-4 w-4 text-green-600 transition-colors duration-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {papeis.length}
            </div>
            <p className="text-xs text-muted-foreground">papéis ativos</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de dados */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Papéis de Governança</CardTitle>
              <CardDescription>
                Lista de todos os papéis cadastrados no sistema
              </CardDescription>
            </div>
            <Button className="gap-2" onClick={() => {
              setSelectedPapel(undefined)
              setFormOpen(true)
            }}>
              <Plus className="h-4 w-4" />
              Novo Papel
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar papéis..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={politicaFilter} onValueChange={setPoliticaFilter}>
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Filtrar por política" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas as políticas</SelectItem>
                {politicas.map((politica) => (
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
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Política Associada</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead className="w-[70px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData?.map((papel) => (
                  <TableRow key={papel.id}>
                    <TableCell className="font-medium">
                      <div className="max-w-[200px] truncate" title={papel.nome}>
                        {papel.nome}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[300px] truncate" title={papel.descricao}>
                        {papel.descricao}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="max-w-[250px] truncate">
                        {getPoliticaNome(papel.politicaId)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(papel.createdAt).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setSelectedPapel(papel)
                            setFormOpen(true)
                          }}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDelete(papel.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Formulário de Criação/Edição */}
      <PapelGovernancaForm 
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open)
          if (!open) {
            setSelectedPapel(undefined)
          }
        }}
        papel={selectedPapel}
      />
    </div>
  )
}