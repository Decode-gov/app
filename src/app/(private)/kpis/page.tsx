"use client"

import { useState } from "react"
import { Plus, Search, MoreHorizontal, Edit, Trash2 } from "lucide-react"
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

  const { data: kpisData, isLoading } = useKpis()
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

  return (
    <div className="space-y-6">
      {/* Stats Card */}
      <div className="grid gap-4 md:grid-cols-1">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de KPIs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.length}</div>
            <p className="text-xs text-muted-foreground">
              {filteredKpis.length} {filteredKpis.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>KPIs</CardTitle>
              <CardDescription>
                Gerencie os indicadores chave de performance
              </CardDescription>
            </div>
            <Button onClick={handleNewKpi}>
              <Plus className="mr-2 h-4 w-4" />
              Novo KPI
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar KPIs..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={processoFilter} onValueChange={setProcessoFilter}>
              <SelectTrigger>
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
              <SelectTrigger>
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
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-sm text-muted-foreground">Carregando...</p>
            </div>
          ) : filteredKpis.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-sm text-muted-foreground">
                {search || processoFilter !== "all" || comunidadeFilter !== "all"
                  ? "Nenhum KPI encontrado com os filtros aplicados."
                  : "Nenhum KPI cadastrado."}
              </p>
              {!search && processoFilter === "all" && comunidadeFilter === "all" && (
                <Button onClick={handleNewKpi} variant="outline" className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Cadastrar primeiro KPI
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
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
                  {filteredKpis.map((kpi) => (
                    <TableRow key={kpi.id}>
                      <TableCell className="font-medium">
                        {kpi.nome}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {kpi.processoId ? getProcessoNome(kpi.processoId) : '-'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {kpi.comunidadeId ? getComunidadeNome(kpi.comunidadeId) : '-'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(kpi.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                        </span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Abrir menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(kpi)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(kpi.id)}
                              className="text-destructive"
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
          )}
        </CardContent>
      </Card>

      <KpiForm
        open={formOpen}
        onOpenChange={setFormOpen}
        kpi={editingKpi}
      />
    </div>
  )
}
