"use client"

import { useState, useMemo } from "react"
import { Upload, Download, FileSpreadsheet, FileJson, FileText, Search, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { useImportacaoExportacao } from "@/hooks/api/use-importacao-exportacao"

// Helpers para labels e cores
const getFormatoIcon = (formato: string) => {
  const icons: Record<string, typeof FileSpreadsheet> = {
    EXCEL: FileSpreadsheet,
    CSV: FileText,
    JSON: FileJson,
  }
  return icons[formato] || FileText
}

const getFormatoLabel = (formato: string) => {
  const labels: Record<string, string> = {
    EXCEL: "Excel",
    CSV: "CSV",
    JSON: "JSON",
  }
  return labels[formato] || formato
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    PENDENTE: "Pendente",
    PROCESSANDO: "Processando",
    CONCLUIDO: "Concluído",
    ERRO: "Erro",
  }
  return labels[status] || status
}

const getStatusBadgeColor = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  const colors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    PENDENTE: "secondary",
    PROCESSANDO: "default",
    CONCLUIDO: "outline",
    ERRO: "destructive",
  }
  return colors[status] || "outline"
}

export default function ImportacaoExportacaoPage() {
  const [search, setSearch] = useState("")
  const [formatoFilter, setFormatoFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Query
  const { data, isLoading } = useImportacaoExportacao()

  const operacoes = data ?? []

  // Stats
  const stats = useMemo(() => {
    return {
      total: operacoes.length,
      concluidas: operacoes.filter((o) => o.status === "CONCLUIDO").length,
      processando: operacoes.filter((o) => o.status === "PROCESSANDO").length,
      erros: operacoes.filter((o) => o.status === "ERRO").length,
    }
  }, [operacoes])

  // Filtros
  const filteredOperacoes = useMemo(() => {
    return operacoes.filter((operacao) => {
      const matchesSearch =
        search === "" ||
        operacao.entidades.some((e) => e.toLowerCase().includes(search.toLowerCase()))

      const matchesFormato = formatoFilter === "all" || operacao.formato === formatoFilter

      const matchesStatus = statusFilter === "all" || operacao.status === statusFilter

      return matchesSearch && matchesFormato && matchesStatus
    })
  }, [operacoes, search, formatoFilter, statusFilter])

  // Formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Importação/Exportação</h1>
          <p className="text-muted-foreground">
            Gerencie importações e exportações de dados do sistema
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Importar
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Operações</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
            <Download className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.concluidas}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processando</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.processando}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Erros</CardTitle>
            <Clock className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.erros}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por entidade..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={formatoFilter} onValueChange={setFormatoFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filtrar por formato" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os formatos</SelectItem>
            <SelectItem value="EXCEL">Excel</SelectItem>
            <SelectItem value="CSV">CSV</SelectItem>
            <SelectItem value="JSON">JSON</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="PENDENTE">Pendente</SelectItem>
            <SelectItem value="PROCESSANDO">Processando</SelectItem>
            <SelectItem value="CONCLUIDO">Concluído</SelectItem>
            <SelectItem value="ERRO">Erro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data/Hora</TableHead>
              <TableHead>Formato</TableHead>
              <TableHead>Entidades</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Arquivo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-[150px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-[80px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[200px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-[100px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-[100px]" />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredOperacoes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Nenhuma operação encontrada
                </TableCell>
              </TableRow>
            ) : (
              filteredOperacoes.map((operacao) => {
                const FormatoIcon = getFormatoIcon(operacao.formato)
                return (
                  <TableRow key={operacao.id}>
                    <TableCell className="font-mono text-xs">
                      {formatDate(operacao.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FormatoIcon className="h-4 w-4 text-muted-foreground" />
                        <span>{getFormatoLabel(operacao.formato)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {operacao.entidades.slice(0, 3).map((entidade, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {entidade}
                          </Badge>
                        ))}
                        {operacao.entidades.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{operacao.entidades.length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeColor(operacao.status)}>
                        {getStatusLabel(operacao.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {operacao.arquivo && operacao.status === "CONCLUIDO" ? (
                        <Button variant="outline" size="sm">
                          <Download className="mr-2 h-3 w-3" />
                          Download
                        </Button>
                      ) : operacao.erro ? (
                        <span className="text-xs text-destructive">{operacao.erro}</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
