"use client"

import { useState } from "react"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useKpis, useDeleteKpi } from "@/hooks/api/use-kpis"
import { useProcessos } from "@/hooks/api/use-processos"
import { useComunidades } from "@/hooks/api/use-comunidades"
import { KpiForm } from "@/components/kpis/kpi-form"
import { KpiResponse } from "@/types/api"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function KpisPage() {
  const [formOpen, setFormOpen] = useState(false)
  const [editingKpi, setEditingKpi] = useState<KpiResponse | undefined>()
  const [search, setSearch] = useState("")
  const [processoFilter, setProcessoFilter] = useState<string>("all")
  const [comunidadeFilter, setComunidadeFilter] = useState<string>("all")

  const { data: kpisData, isLoading, error } = useKpis()
  const { data: processosData } = useProcessos()
  const { data: comunidadesData } = useComunidades()
  const deleteMutation = useDeleteKpi()

  const kpis = kpisData?.data || []
  const processos = processosData?.data || []
  const comunidades = comunidadesData?.data || []

  const filteredKpis = kpis.filter((kpi) => {
    const matchesSearch = 
      search === "" ||
      kpi.nome.toLowerCase().includes(search.toLowerCase())
    
    const matchesProcesso = 
      processoFilter === "all" || 
      kpi.processoId === processoFilter

    const matchesComunidade = 
      comunidadeFilter === "all" || 
      kpi.comunidadeId === comunidadeFilter

    return matchesSearch && matchesProcesso && matchesComunidade
  })

  const handleEdit = (kpi: KpiResponse) => {
    setEditingKpi(kpi)
    setFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este KPI?")) {
      try {
        await deleteMutation.mutateAsync(id)
      } catch (error) {
        console.error('Erro ao excluir KPI:', error)
      }
    }
  }

  const handleNewKpi = () => {
    setEditingKpi(undefined)
    setFormOpen(true)
  }

  const getProcessoNome = (processoId: string) => {
    const processo = processos.find(p => p.id === processoId)
    return processo?.nome || "N/A"
  }

  const getComunidadeNome = (comunidadeId: string) => {
    const comunidade = comunidades.find(c => c.id === comunidadeId)
    return comunidade?.nome || "N/A"
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            KPIs
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie os indicadores chave de performance
          </p>
        </div>

        <Card className="animate-pulse">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-[60px] mb-2" />
            <Skeleton className="h-3 w-[120px]" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 space-y-4">
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
            KPIs
          </h1>
          <p className="text-muted-foreground mt-2">
            Erro ao carregar KPIs
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
          KPIs
        </h1>
        <p className="text-muted-foreground mt-2">
          Gerencie os indicadores chave de performance no sistema DECODE-GOV
        </p>
      </div>

      {/* Card de estatística */}
      <Card className="group hover:shadow-lg transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de KPIs</CardTitle>
          <div className="p-2 rounded-lg bg-purple-100 group-hover:bg-purple-200 transition-colors duration-300">
            <TrendingUp className="h-4 w-4 text-purple-600 transition-colors duration-300" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">
            {kpis.length}
          </div>
          <p className="text-xs text-muted-foreground">
            {filteredKpis.length} {filteredKpis.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
          </p>
        </CardContent>
      </Card>

      {/* Tabela de dados */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Indicadores Chave de Performance</CardTitle>
              <CardDescription>
                Lista de todos os KPIs cadastrados
              </CardDescription>
            </div>
            <Button className="gap-2" onClick={handleNewKpi}>
              <Plus className="h-4 w-4" />
              Novo KPI
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar KPIs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={processoFilter} onValueChange={setProcessoFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filtrar por processo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os processos</SelectItem>
                {processos.map((processo) => (
                  <SelectItem key={processo.id} value={processo.id}>
                    {processo.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={comunidadeFilter} onValueChange={setComunidadeFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filtrar por comunidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as comunidades</SelectItem>
                {comunidades.map((comunidade) => (
                  <SelectItem key={comunidade.id} value={comunidade.id}>
                    {comunidade.nome}
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
                  <TableHead>Processo</TableHead>
                  <TableHead>Comunidade</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead className="w-[70px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredKpis.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      {search || processoFilter !== "all" || comunidadeFilter !== "all"
                        ? "Nenhum KPI encontrado com os filtros aplicados"
                        : "Nenhum KPI cadastrado"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredKpis.map((kpi) => (
                    <TableRow key={kpi.id}>
                      <TableCell className="font-medium max-w-[300px]">
                        <div className="truncate" title={kpi.nome}>
                          {kpi.nome}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        <div className="truncate" title={kpi.processoId ? getProcessoNome(kpi.processoId) : '-'}>
                          {kpi.processoId ? getProcessoNome(kpi.processoId) : '-'}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        <div className="truncate" title={kpi.comunidadeId ? getComunidadeNome(kpi.comunidadeId) : '-'}>
                          {kpi.comunidadeId ? getComunidadeNome(kpi.comunidadeId) : '-'}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(kpi.createdAt), "dd/MM/yyyy", { locale: ptBR })}
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
                            <DropdownMenuItem onClick={() => handleEdit(kpi)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDelete(kpi.id)}
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

      {/* Formulário de Criação/Edição */}
      <KpiForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open)
          if (!open) {
            setEditingKpi(undefined)
          }
        }}
        kpi={editingKpi}
      />
    </div>
  )
}
