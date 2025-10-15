"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Search, MoreHorizontal, Edit, Trash2, ListTodo, Clock, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAtividades, useDeleteAtividade } from "@/hooks/api/use-atividades"
import { useProcessos } from "@/hooks/api/use-processos"
import { AtividadeResponse } from "@/types/api"
import { AtividadeForm } from "@/components/atividades/atividade-form"

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    PLANEJADA: "Planejada",
    EM_ANDAMENTO: "Em Andamento",
    CONCLUIDA: "Concluída",
    PAUSADA: "Pausada",
    CANCELADA: "Cancelada",
  }
  return labels[status] || status
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    PLANEJADA: "bg-gray-100 text-gray-800",
    EM_ANDAMENTO: "bg-blue-100 text-blue-800",
    CONCLUIDA: "bg-green-100 text-green-800",
    PAUSADA: "bg-yellow-100 text-yellow-800",
    CANCELADA: "bg-red-100 text-red-800",
  }
  return colors[status] || "bg-gray-100 text-gray-800"
}

const getPrioridadeLabel = (prioridade: string) => {
  const labels: Record<string, string> = {
    BAIXA: "Baixa",
    MEDIA: "Média",
    ALTA: "Alta",
    CRITICA: "Crítica",
  }
  return labels[prioridade] || prioridade
}

const getPrioridadeColor = (prioridade: string) => {
  const colors: Record<string, string> = {
    BAIXA: "bg-green-100 text-green-800",
    MEDIA: "bg-blue-100 text-blue-800",
    ALTA: "bg-orange-100 text-orange-800",
    CRITICA: "bg-red-100 text-red-800",
  }
  return colors[prioridade] || "bg-gray-100 text-gray-800"
}

export default function AtividadesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [prioridadeFilter, setPrioridadeFilter] = useState<string>("")
  const [page] = useState(1)
  const [limit] = useState(10)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedAtividade, setSelectedAtividade] = useState<AtividadeResponse | undefined>()

  const queryParams: Record<string, string | number | undefined> = {
    page,
    limit,
    search: searchTerm || undefined,
  }
  
  if (statusFilter) queryParams.status = statusFilter
  if (prioridadeFilter) queryParams.prioridade = prioridadeFilter

  const { data: atividadesData, isLoading, error } = useAtividades(queryParams)
  const { data: processosData } = useProcessos({ page: 1, limit: 1000 })
  
  const deleteAtividade = useDeleteAtividade()

  const handleEdit = (atividade: AtividadeResponse) => {
    setSelectedAtividade(atividade)
    setIsFormOpen(true)
  }

  const handleNew = () => {
    setSelectedAtividade(undefined)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta atividade?")) {
      await deleteAtividade.mutateAsync(id)
    }
  }

  const atividades = atividadesData?.data || []
  const processos = processosData?.data || []

  const atividadesEmAndamento = atividades.filter(a => a.status === 'EM_ANDAMENTO').length
  const atividadesConcluidas = atividades.filter(a => a.status === 'CONCLUIDA').length
  const atividadesCriticas = atividades.filter(a => a.prioridade === 'CRITICA').length

  return (
    <>
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Atividades
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie as atividades e tarefas do sistema DECODE-GOV
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <div className="p-2 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors duration-300">
                <ListTodo className="h-4 w-4 text-blue-600 transition-colors duration-300" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{atividadesData?.total || 0}</div>
              <p className="text-xs text-muted-foreground">atividades cadastradas</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
              <div className="p-2 rounded-lg bg-green-100 group-hover:bg-green-200 transition-colors duration-300">
                <Clock className="h-4 w-4 text-green-600 transition-colors duration-300" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{atividadesEmAndamento}</div>
              <p className="text-xs text-muted-foreground">em execução</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
              <div className="p-2 rounded-lg bg-purple-100 group-hover:bg-purple-200 transition-colors duration-300">
                <ListTodo className="h-4 w-4 text-purple-600 transition-colors duration-300" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{atividadesConcluidas}</div>
              <p className="text-xs text-muted-foreground">finalizadas</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Críticas</CardTitle>
              <div className="p-2 rounded-lg bg-red-100 group-hover:bg-red-200 transition-colors duration-300">
                <AlertTriangle className="h-4 w-4 text-red-600 transition-colors duration-300" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{atividadesCriticas}</div>
              <p className="text-xs text-muted-foreground">prioridade crítica</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Atividades</CardTitle>
                <CardDescription>
                  Lista de todas as atividades cadastradas
                </CardDescription>
              </div>
              <Button className="gap-2" onClick={handleNew}>
                <Plus className="h-4 w-4" />
                Nova Atividade
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar atividades..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={statusFilter || "todos"} onValueChange={(value) => setStatusFilter(value === "todos" ? "" : value)}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os status</SelectItem>
                  <SelectItem value="PLANEJADA">Planejada</SelectItem>
                  <SelectItem value="EM_ANDAMENTO">Em Andamento</SelectItem>
                  <SelectItem value="CONCLUIDA">Concluída</SelectItem>
                  <SelectItem value="PAUSADA">Pausada</SelectItem>
                  <SelectItem value="CANCELADA">Cancelada</SelectItem>
                </SelectContent>
              </Select>
              <Select value={prioridadeFilter || "todas"} onValueChange={(value) => setPrioridadeFilter(value === "todas" ? "" : value)}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  <SelectItem value="BAIXA">Baixa</SelectItem>
                  <SelectItem value="MEDIA">Média</SelectItem>
                  <SelectItem value="ALTA">Alta</SelectItem>
                  <SelectItem value="CRITICA">Crítica</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <Skeleton className="h-[400px] w-full" />
            ) : error ? (
              <p className="text-center text-muted-foreground py-8">
                Erro ao carregar atividades. Tente novamente.
              </p>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Prioridade</TableHead>
                      <TableHead>Processo</TableHead>
                      <TableHead>Responsável</TableHead>
                      <TableHead>Prazo</TableHead>
                      <TableHead className="w-[70px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {atividades.map((atividade: AtividadeResponse) => {
                      const processo = processos.find(p => p.id === atividade.processoId)
                      const dataFim = atividade.dataFim ? new Date(atividade.dataFim).toLocaleDateString('pt-BR') : null

                      return (
                        <TableRow key={atividade.id}>
                          <TableCell className="font-medium">
                            {atividade.nome}
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(atividade.status)}>
                              {getStatusLabel(atividade.status)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getPrioridadeColor(atividade.prioridade)}>
                              {getPrioridadeLabel(atividade.prioridade)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {processo ? (
                              <Badge variant="outline">{processo.nome}</Badge>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {atividade.responsavel || <span className="text-muted-foreground">-</span>}
                          </TableCell>
                          <TableCell>
                            {dataFim || <span className="text-muted-foreground">-</span>}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEdit(atividade)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-destructive"
                                  onClick={() => handleDelete(atividade.id)}
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

      <AtividadeForm open={isFormOpen} onOpenChange={setIsFormOpen} atividade={selectedAtividade} />
    </>
  )
}
