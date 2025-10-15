"use client"

import { useState, useMemo } from "react"
import { Plus, Workflow, Search, Bot, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { useOperacoes, useDeleteOperacao } from "@/hooks/api/use-operacoes"
import { useAtividades } from "@/hooks/api/use-atividades"
import { OperacaoForm } from "@/components/operacoes/operacao-form"
import type { OperacaoResponse } from "@/types/api"

// Helpers para labels
const getTipoLabel = (tipo: string) => {
  const labels: Record<string, string> = {
    CREATE: "Criação",
    READ: "Leitura",
    UPDATE: "Atualização",
    DELETE: "Exclusão",
    PROCESS: "Processamento",
    VALIDATE: "Validação",
    TRANSFORM: "Transformação",
  }
  return labels[tipo] || tipo
}

const getTipoBadgeColor = (tipo: string): "default" | "secondary" | "destructive" | "outline" => {
  const colors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    CREATE: "default",
    READ: "secondary",
    UPDATE: "outline",
    DELETE: "destructive",
    PROCESS: "default",
    VALIDATE: "secondary",
    TRANSFORM: "outline",
  }
  return colors[tipo] || "outline"
}

const getFrequenciaLabel = (frequencia: string) => {
  const labels: Record<string, string> = {
    UNICA: "Única",
    DIARIA: "Diária",
    SEMANAL: "Semanal",
    MENSAL: "Mensal",
    TRIMESTRAL: "Trimestral",
    ANUAL: "Anual",
    EVENTUAL: "Eventual",
  }
  return labels[frequencia] || frequencia
}

const getComplexidadeColor = (complexidade: string) => {
  const colors: Record<string, string> = {
    BAIXA: "text-green-600",
    MEDIA: "text-yellow-600",
    ALTA: "text-red-600",
  }
  return colors[complexidade] || "text-gray-600"
}

const getComplexidadeLabel = (complexidade: string) => {
  const labels: Record<string, string> = {
    BAIXA: "Baixa",
    MEDIA: "Média",
    ALTA: "Alta",
  }
  return labels[complexidade] || complexidade
}

export default function OperacoesPage() {
  const [formOpen, setFormOpen] = useState(false)
  const [selectedOperacao, setSelectedOperacao] = useState<OperacaoResponse | undefined>()
  const [search, setSearch] = useState("")
  const [tipoFilter, setTipoFilter] = useState<string>("all")
  const [frequenciaFilter, setFrequenciaFilter] = useState<string>("all")

  // Queries
  const { data, isLoading } = useOperacoes({ page: 1, limit: 1000 })
  const { data: atividadesData } = useAtividades({ page: 1, limit: 1000 })
  const { mutate: deleteOperacao } = useDeleteOperacao()

  const operacoes = data?.data ?? []
  const atividades = atividadesData?.data ?? []

  // Helper para encontrar atividade
  const getAtividadeNome = (atividadeId: string) => {
    const atividade = atividades.find((a) => a.id === atividadeId)
    return atividade?.nome ?? "N/A"
  }

  // Stats
  const stats = useMemo(() => {
    return {
      total: operacoes.length,
      automatizadas: operacoes.filter((o) => o.automatizada).length,
      criticas: operacoes.filter((o) => o.critica).length,
      complexidadeAlta: operacoes.filter((o) => o.complexidade === "ALTA").length,
    }
  }, [operacoes])

  // Filtros
  const filteredOperacoes = useMemo(() => {
    return operacoes.filter((operacao) => {
      const matchesSearch =
        search === "" || operacao.nome.toLowerCase().includes(search.toLowerCase())

      const matchesTipo = tipoFilter === "all" || operacao.tipo === tipoFilter

      const matchesFrequencia =
        frequenciaFilter === "all" || operacao.frequencia === frequenciaFilter

      return matchesSearch && matchesTipo && matchesFrequencia
    })
  }, [operacoes, search, tipoFilter, frequenciaFilter])

  const handleEdit = (operacao: OperacaoResponse) => {
    setSelectedOperacao(operacao)
    setFormOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta operação?")) {
      deleteOperacao(id)
    }
  }

  const handleCloseForm = () => {
    setFormOpen(false)
    setSelectedOperacao(undefined)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Operações</h1>
          <p className="text-muted-foreground">
            Gerencie as operações executadas nas atividades do sistema
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Operação
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Operações</CardTitle>
            <Workflow className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Automatizadas</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.automatizadas}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Críticas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.criticas}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Complexidade Alta</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.complexidadeAlta}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={tipoFilter} onValueChange={setTipoFilter}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            {["CREATE", "READ", "UPDATE", "DELETE", "PROCESS", "VALIDATE", "TRANSFORM"].map((tipo) => (
              <SelectItem key={tipo} value={tipo}>
                {getTipoLabel(tipo)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={frequenciaFilter} onValueChange={setFrequenciaFilter}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Filtrar por frequência" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as frequências</SelectItem>
            {["UNICA", "DIARIA", "SEMANAL", "MENSAL", "TRIMESTRAL", "ANUAL", "EVENTUAL"].map((freq) => (
              <SelectItem key={freq} value={freq}>
                {getFrequenciaLabel(freq)}
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
              <TableHead>Tipo</TableHead>
              <TableHead>Frequência</TableHead>
              <TableHead>Complexidade</TableHead>
              <TableHead>Atividade</TableHead>
              <TableHead>Status</TableHead>
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
                    <Skeleton className="h-5 w-[100px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[100px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[80px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-[100px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-[60px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-8" />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredOperacoes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  Nenhuma operação encontrada
                </TableCell>
              </TableRow>
            ) : (
              filteredOperacoes.map((operacao) => (
                <TableRow key={operacao.id}>
                  <TableCell className="font-medium">{operacao.nome}</TableCell>
                  <TableCell>
                    <Badge variant={getTipoBadgeColor(operacao.tipo)}>
                      {getTipoLabel(operacao.tipo)}
                    </Badge>
                  </TableCell>
                  <TableCell>{getFrequenciaLabel(operacao.frequencia)}</TableCell>
                  <TableCell>
                    <span className={getComplexidadeColor(operacao.complexidade)}>
                      {getComplexidadeLabel(operacao.complexidade)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{getAtividadeNome(operacao.atividadeId)}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {operacao.automatizada && (
                        <Badge variant="secondary" className="text-xs">
                          <Bot className="mr-1 h-3 w-3" />
                          Auto
                        </Badge>
                      )}
                      {operacao.critica && (
                        <Badge variant="destructive" className="text-xs">
                          <AlertTriangle className="mr-1 h-3 w-3" />
                          Crítica
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(operacao)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(operacao.id)}
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
      <OperacaoForm open={formOpen} onOpenChange={handleCloseForm} operacao={selectedOperacao} />
    </div>
  )
}
