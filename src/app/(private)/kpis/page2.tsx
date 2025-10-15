"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Search, MoreHorizontal, Edit, Trash2, TrendingUp, Target, Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useKpis, useDeleteKpi } from "@/hooks/api/use-kpis"
import { useComunidades } from "@/hooks/api/use-comunidades"
import { useProcessos } from "@/hooks/api/use-processos"
import { KpiResponse } from "@/types/api"
import { KpiForm } from "@/components/kpis/kpi-form"

const getPeriodicidadeLabel = (periodicidade?: string) => {
  if (!periodicidade) return "-"
  const labels: Record<string, string> = {
    DIARIA: "Diária",
    SEMANAL: "Semanal",
    MENSAL: "Mensal",
    TRIMESTRAL: "Trimestral",
    SEMESTRAL: "Semestral",
    ANUAL: "Anual",
  }
  return labels[periodicidade] || periodicidade
}

const getPeriodicidadeColor = (periodicidade?: string) => {
  if (!periodicidade) return "bg-gray-100 text-gray-800"
  const colors: Record<string, string> = {
    DIARIA: "bg-red-100 text-red-800",
    SEMANAL: "bg-orange-100 text-orange-800",
    MENSAL: "bg-blue-100 text-blue-800",
    TRIMESTRAL: "bg-purple-100 text-purple-800",
    SEMESTRAL: "bg-green-100 text-green-800",
    ANUAL: "bg-indigo-100 text-indigo-800",
  }
  return colors[periodicidade] || "bg-gray-100 text-gray-800"
}

export default function KpisPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [periodicidadeFilter, setPeriodicidadeFilter] = useState<string>("")
  const [page] = useState(1)
  const [limit] = useState(10)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedKpi, setSelectedKpi] = useState<KpiResponse | undefined>()

  const queryParams: Record<string, string | number | undefined> = {
    page,
    limit,
    search: searchTerm || undefined,
  }
  
  if (periodicidadeFilter) queryParams.periodicidade = periodicidadeFilter

  const { data: kpisData, isLoading, error } = useKpis(queryParams)
  const { data: comunidadesData } = useComunidades({ page: 1, limit: 1000 })
  const { data: processosData } = useProcessos({ page: 1, limit: 1000 })
  
  const deleteKpi = useDeleteKpi()

  const handleEdit = (kpi: KpiResponse) => {
    setSelectedKpi(kpi)
    setIsFormOpen(true)
  }

  const handleNew = () => {
    setSelectedKpi(undefined)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este KPI?")) {
      await deleteKpi.mutateAsync(id)
    }
  }

  const kpis = kpisData?.data || []
  const comunidades = comunidadesData?.data || []
  const processos = processosData?.data || []

  const kpisComFormula = kpis.filter(k => k.formula).length
  const kpisComResponsavel = kpis.filter(k => k.responsavelId).length
  const dominiosUnicos = [...new Set(kpis.map(k => k.dominioId))].length

  return (
    <>
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            KPIs
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie os indicadores-chave de desempenho do sistema DECODE-GOV
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de KPIs</CardTitle>
              <div className="p-2 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors duration-300">
                <TrendingUp className="h-4 w-4 text-blue-600 transition-colors duration-300" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{kpisData?.total || 0}</div>
              <p className="text-xs text-muted-foreground">KPIs cadastrados</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Domínios</CardTitle>
              <div className="p-2 rounded-lg bg-green-100 group-hover:bg-green-200 transition-colors duration-300">
                <Target className="h-4 w-4 text-green-600 transition-colors duration-300" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{dominiosUnicos}</div>
              <p className="text-xs text-muted-foreground">domínios cobertos</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Com Fórmula</CardTitle>
              <div className="p-2 rounded-lg bg-purple-100 group-hover:bg-purple-200 transition-colors duration-300">
                <Calendar className="h-4 w-4 text-purple-600 transition-colors duration-300" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{kpisComFormula}</div>
              <p className="text-xs text-muted-foreground">KPIs com fórmula definida</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Com Responsável</CardTitle>
              <div className="p-2 rounded-lg bg-orange-100 group-hover:bg-orange-200 transition-colors duration-300">
                <Target className="h-4 w-4 text-orange-600 transition-colors duration-300" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{kpisComResponsavel}</div>
              <p className="text-xs text-muted-foreground">com responsável atribuído</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Indicadores de Desempenho</CardTitle>
                <CardDescription>
                  Lista de todos os KPIs cadastrados
                </CardDescription>
              </div>
              <Button className="gap-2" onClick={handleNew}>
                <Plus className="h-4 w-4" />
                Novo KPI
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar KPIs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={periodicidadeFilter || "todas"} onValueChange={(value) => setPeriodicidadeFilter(value === "todas" ? "" : value)}>
                <SelectTrigger className="w-full md:w-[250px]">
                  <SelectValue placeholder="Filtrar por periodicidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as periodicidades</SelectItem>
                  <SelectItem value="DIARIA">Diária</SelectItem>
                  <SelectItem value="SEMANAL">Semanal</SelectItem>
                  <SelectItem value="MENSAL">Mensal</SelectItem>
                  <SelectItem value="TRIMESTRAL">Trimestral</SelectItem>
                  <SelectItem value="SEMESTRAL">Semestral</SelectItem>
                  <SelectItem value="ANUAL">Anual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <Skeleton className="h-[400px] w-full" />
            ) : error ? (
              <p className="text-center text-muted-foreground py-8">
                Erro ao carregar KPIs. Tente novamente.
              </p>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Domínio</TableHead>
                      <TableHead>Processo</TableHead>
                      <TableHead>Periodicidade</TableHead>
                      <TableHead className="w-[70px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {kpis.map((kpi: KpiResponse) => {
                      const dominio = comunidades.find(c => c.id === kpi.dominioId)
                      const processo = processos.find(p => p.id === kpi.processoId)

                      return (
                        <TableRow key={kpi.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <TrendingUp className="h-4 w-4 text-blue-500" />
                              {kpi.nome}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-[300px] truncate" title={kpi.descricao}>
                              {kpi.descricao}
                            </div>
                          </TableCell>
                          <TableCell>
                            {dominio ? (
                              <Badge variant="secondary">{dominio.nome}</Badge>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {processo ? (
                              <Badge variant="outline">{processo.nome}</Badge>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {kpi.periodicidade ? (
                              <Badge className={getPeriodicidadeColor(kpi.periodicidade)}>
                                {getPeriodicidadeLabel(kpi.periodicidade)}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">-</span>
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
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <KpiForm open={isFormOpen} onOpenChange={setIsFormOpen} kpi={selectedKpi} />
    </>
  )
}
