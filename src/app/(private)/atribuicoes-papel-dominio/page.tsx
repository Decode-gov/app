"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Edit, Trash2, Workflow, X } from "lucide-react"
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
import { useAtribuicoes, useDeleteAtribuicao } from "@/hooks/api/use-atribuicoes"
import { usePapeis } from "@/hooks/api/use-papeis"
import { useComunidades } from "@/hooks/api/use-comunidades"
import { AtribuicaoForm } from "@/components/atribuicoes/atribuicao-form"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { AtribuicaoResponse, TipoEntidadeAtribuicao } from "@/types/api"

const tiposEntidade: TipoEntidadeAtribuicao[] = [
  'Politica', 'Papel', 'Atribuicao', 'Processo', 'Termo', 'KPI', 
  'RegraNegocio', 'RegraQualidade', 'Dominio', 'Sistema', 'Tabela', 'Coluna'
];

export default function AtribuicoesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [papelFilter, setPapelFilter] = useState("")
  const [dominioFilter, setDominioFilter] = useState("")
  const [tipoEntidadeFilter, setTipoEntidadeFilter] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [selectedAtribuicao, setSelectedAtribuicao] = useState<AtribuicaoResponse | undefined>()

  const { data: atribuicoesData, isLoading, error } = useAtribuicoes({
    page: 1,
    limit: 1000,
    papelId: papelFilter && papelFilter !== "all" ? papelFilter : undefined,
    dominioId: dominioFilter && dominioFilter !== "all" ? dominioFilter : undefined,
    tipoEntidade: tipoEntidadeFilter && tipoEntidadeFilter !== "all" ? (tipoEntidadeFilter as TipoEntidadeAtribuicao) : undefined,
  })
  const { data: papeisData } = usePapeis({ page: 1, limit: 1000 })
  const { data: comunidadesData } = useComunidades({ page: 1, limit: 1000 })
  const deleteAtribuicao = useDeleteAtribuicao()

  const papeis = papeisData?.data ?? []
  const dominios = comunidadesData?.data ?? []

  // Extração do array de dados
  const atribuicoes = atribuicoesData?.data ?? []

  // Filtro local apenas para busca por texto nos nomes
  const filteredData = atribuicoes.filter((atribuicao) => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()
    return (
      atribuicao.papel.nome.toLowerCase().includes(searchLower) ||
      atribuicao.dominio.nome.toLowerCase().includes(searchLower) ||
      atribuicao.tipoEntidade.toLowerCase().includes(searchLower)
    )
  })

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta atribuição?")) {
      await deleteAtribuicao.mutateAsync(id)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Atribuições Papel↔Domínio
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie as atribuições entre papéis e domínios
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
            Atribuições Papel↔Domínio
          </h1>
          <p className="text-muted-foreground mt-2">
            Erro ao carregar atribuições
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Atribuições Papel↔Domínio
        </h1>
        <p className="text-muted-foreground mt-2">
          Gerencie as atribuições entre papéis e domínios do sistema DECODE-GOV
        </p>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Atribuições</CardTitle>
            <div className="p-2 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors duration-300">
              <Workflow className="h-4 w-4 text-blue-600 transition-colors duration-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {atribuicoes.length}
            </div>
            <p className="text-xs text-muted-foreground">atribuições cadastradas</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Com Onboarding</CardTitle>
            <div className="p-2 rounded-lg bg-green-100 group-hover:bg-green-200 transition-colors duration-300">
              <Workflow className="h-4 w-4 text-green-600 transition-colors duration-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {atribuicoes.filter(a => a.onboarding).length}
            </div>
            <p className="text-xs text-muted-foreground">requerem onboarding</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vigentes</CardTitle>
            <div className="p-2 rounded-lg bg-purple-100 group-hover:bg-purple-200 transition-colors duration-300">
              <Workflow className="h-4 w-4 text-purple-600 transition-colors duration-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {atribuicoes.filter(a => !a.dataTermino || new Date(a.dataTermino) > new Date()).length}
            </div>
            <p className="text-xs text-muted-foreground">atribuições ativas</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de dados */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Atribuições Cadastradas</CardTitle>
              <CardDescription>
                Lista de todas as atribuições entre papéis e domínios cadastradas
              </CardDescription>
            </div>
            <Button className="gap-2" onClick={() => {
              setSelectedAtribuicao(undefined)
              setFormOpen(true)
            }}>
              <Plus className="h-4 w-4" />
              Nova Atribuição
            </Button>
          </div>
        </CardHeader>
<CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Busca por texto */}
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>

            {/* Filtro por Papel */}
            <Select value={papelFilter} onValueChange={setPapelFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filtrar por Papel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Papéis</SelectItem>
                {papeis.map((papel) => (
                  <SelectItem key={papel.id} value={papel.id}>
                    {papel.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Filtro por Domínio */}
            <Select value={dominioFilter} onValueChange={setDominioFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filtrar por Domínio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Domínios</SelectItem>
                {dominios.map((dominio) => (
                  <SelectItem key={dominio.id} value={dominio.id}>
                    {dominio.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Filtro por Tipo de Entidade */}
            <Select value={tipoEntidadeFilter} onValueChange={setTipoEntidadeFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filtrar por Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Tipos</SelectItem>
                {tiposEntidade.map((tipo) => (
                  <SelectItem key={tipo} value={tipo}>
                    {tipo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Botão Limpar Filtros */}
            {(papelFilter || dominioFilter || tipoEntidadeFilter || searchTerm) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setPapelFilter("")
                  setDominioFilter("")
                  setTipoEntidadeFilter("")
                  setSearchTerm("")
                }}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Limpar Filtros
              </Button>
            )}
          </div>

<div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Papel</TableHead>
                  <TableHead>Domínio</TableHead>
                  <TableHead>Tipo de Entidade</TableHead>
                  <TableHead>Data Início Vigência</TableHead>
                  <TableHead className="text-center">Onboarding</TableHead>
                  <TableHead className="w-[70px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      Nenhuma atribuição encontrada
                    </TableCell>
                  </TableRow>
                ) : filteredData?.map((atribuicao) => (
                  <TableRow key={atribuicao.id}>
                    <TableCell className="font-medium">
                      <div className="max-w-[200px] truncate" title={atribuicao.papel.nome}>
                        {atribuicao.papel.nome}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[200px] truncate" title={atribuicao.dominio.nome}>
                        {atribuicao.dominio.nome}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="inline-flex items-center px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        {atribuicao.tipoEntidade}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(atribuicao.dataInicioVigencia).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-center">
                      {atribuicao.onboarding ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                          Sim
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">
                          Não
                        </span>
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
                          <DropdownMenuItem onClick={() => {
                            setSelectedAtribuicao(atribuicao)
                            setFormOpen(true)
                          }}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDelete(atribuicao.id)}
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
      <AtribuicaoForm 
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open)
          if (!open) {
            setSelectedAtribuicao(undefined)
          }
        }}
        atribuicao={selectedAtribuicao}
      />
    </div>
  )
}
