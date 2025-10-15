"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Eye, Edit, Trash2, Shield } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { usePoliticasInternas, useDeletePoliticaInterna } from "@/hooks/api/use-politicas-internas"
import { PoliticaInternaForm } from "@/components/politicas/politica-interna-form"
import { Skeleton } from "@/components/ui/skeleton"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { PoliticaInternaResponse } from "@/types/api"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const statusBadgeMap: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
  ATIVA: { variant: "default", label: "Ativa" },
  REVOGADA: { variant: "destructive", label: "Revogada" },
  EM_REVISAO: { variant: "outline", label: "Em Revisão" },
}

const escopoLabels: Record<string, string> = {
  SEGURANCA: "Segurança",
  QUALIDADE: "Qualidade",
  GOVERNANCA: "Governança",
  OUTRO: "Outro",
}

export default function PoliticasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [escopoFilter, setEscopoFilter] = useState<string>("")
  const [formOpen, setFormOpen] = useState(false)
  const [selectedPolitica, setSelectedPolitica] = useState<PoliticaInternaResponse | undefined>()

  const { data: politicasData, isLoading, error } = usePoliticasInternas()
  const deletePolitica = useDeletePoliticaInterna()

  // Extração do array de dados
  const politicas = politicasData?.data ?? []

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta política interna?")) {
      await deletePolitica.mutateAsync(id)
    }
  }

  // Filtrar dados localmente
  const filteredData = politicas.filter((politica) => {
    const matchesSearch = politica.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (politica.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    const matchesStatus = !statusFilter || politica.status === statusFilter
    const matchesEscopo = !escopoFilter || politica.escopo === escopoFilter
    return matchesSearch && matchesStatus && matchesEscopo
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Políticas Internas
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie as políticas internas de governança de dados
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
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
            Políticas Internas
          </h1>
          <p className="text-muted-foreground mt-2">
            Erro ao carregar políticas internas
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Políticas Internas
        </h1>
        <p className="text-muted-foreground mt-2">
          Gerencie as políticas internas de governança de dados do sistema DECODE-GOV
        </p>
      </div>

      {/* Cards de estatísticas por Status */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativas</CardTitle>
            <div className="p-2 rounded-lg bg-green-100 group-hover:bg-green-200 transition-colors duration-300">
              <Shield className="h-4 w-4 text-green-600 transition-colors duration-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {politicas.filter(p => p.status === "ATIVA").length}
            </div>
            <p className="text-xs text-muted-foreground">políticas ativas</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Revisão</CardTitle>
            <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-slate-200 transition-colors duration-300">
              <Shield className="h-4 w-4 text-slate-600 transition-colors duration-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-700">
              {politicas.filter(p => p.status === "EM_REVISAO").length}
            </div>
            <p className="text-xs text-muted-foreground">em elaboração</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revogadas</CardTitle>
            <div className="p-2 rounded-lg bg-red-100 group-hover:bg-red-200 transition-colors duration-300">
              <Shield className="h-4 w-4 text-red-600 transition-colors duration-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {politicas.filter(p => p.status === "REVOGADA").length}
            </div>
            <p className="text-xs text-muted-foreground">revogadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de dados */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Políticas Internas</CardTitle>
              <CardDescription>
                Lista de todas as políticas internas de governança cadastradas
              </CardDescription>
            </div>
            <Button className="gap-2" onClick={() => {
              setSelectedPolitica(undefined)
              setFormOpen(true)
            }}>
              <Plus className="h-4 w-4" />
              Nova Política
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar políticas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={escopoFilter} onValueChange={setEscopoFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por escopo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os escopos</SelectItem>
                <SelectItem value="SEGURANCA">Segurança</SelectItem>
                <SelectItem value="QUALIDADE">Qualidade</SelectItem>
                <SelectItem value="GOVERNANCA">Governança</SelectItem>
                <SelectItem value="OUTRO">Outro</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os status</SelectItem>
                <SelectItem value="ATIVA">Ativa</SelectItem>
                <SelectItem value="REVOGADA">Revogada</SelectItem>
                <SelectItem value="EM_REVISAO">Em Revisão</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Escopo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Início da Vigência</TableHead>
                  <TableHead className="w-[70px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData?.map((politica) => (
                  <TableRow key={politica.id}>
                    <TableCell className="font-medium">
                      <div className="max-w-[200px] truncate" title={politica.nome}>
                        {politica.nome}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[250px] truncate" title={politica.descricao || ''}>
                        {politica.descricao || '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{escopoLabels[politica.escopo]}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusBadgeMap[politica.status]?.variant || 'outline'}>
                        {statusBadgeMap[politica.status]?.label || politica.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(politica.dataInicioVigencia).toLocaleDateString('pt-BR')}
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
                            setSelectedPolitica(politica)
                            setFormOpen(true)
                          }}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDelete(politica.id)}
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
      <PoliticaInternaForm 
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open)
          if (!open) {
            setSelectedPolitica(undefined)
          }
        }}
        politica={selectedPolitica}
      />
    </div>
  )
}