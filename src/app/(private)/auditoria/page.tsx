"use client"

import { useState, useMemo } from "react"
import { Shield, Search, Calendar, User, Activity } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuditoria } from "@/hooks/api/use-auditoria"

// Helper para status HTTP
const getStatusBadgeColor = (status: number): "default" | "secondary" | "destructive" => {
  if (status >= 200 && status < 300) return "default"
  if (status >= 400 && status < 500) return "destructive"
  if (status >= 500) return "destructive"
  return "secondary"
}

const getMetodoColor = (metodo: string) => {
  const colors: Record<string, string> = {
    GET: "text-blue-600",
    POST: "text-green-600",
    PUT: "text-yellow-600",
    DELETE: "text-red-600",
    PATCH: "text-purple-600",
  }
  return colors[metodo] || "text-gray-600"
}

export default function AuditoriaPage() {
  const [search, setSearch] = useState("")
  const [metodoFilter, setMetodoFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Query
  const { data, isLoading } = useAuditoria({ page: 1, limit: 1000 })

  const logs = data?.data ?? []

  // Stats
  const stats = useMemo(() => {
    return {
      total: logs.length,
      sucesso: logs.filter((l) => l.status >= 200 && l.status < 300).length,
      erro: logs.filter((l) => l.status >= 400).length,
      usuariosUnicos: new Set(logs.map((l) => l.usuario)).size,
    }
  }, [logs])

  // Filtros
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        search === "" ||
        log.usuario.toLowerCase().includes(search.toLowerCase()) ||
        log.endpoint.toLowerCase().includes(search.toLowerCase())

      const matchesMetodo = metodoFilter === "all" || log.metodo === metodoFilter

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "2xx" && log.status >= 200 && log.status < 300) ||
        (statusFilter === "4xx" && log.status >= 400 && log.status < 500) ||
        (statusFilter === "5xx" && log.status >= 500)

      return matchesSearch && matchesMetodo && matchesStatus
    })
  }, [logs, search, metodoFilter, statusFilter])

  // Formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Auditoria & Logs</h1>
          <p className="text-muted-foreground">
            Visualize o histórico de operações e logs do sistema
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Logs</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sucesso</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.sucesso}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Erros</CardTitle>
            <Activity className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.erro}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Únicos</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.usuariosUnicos}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por usuário ou endpoint..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={metodoFilter} onValueChange={setMetodoFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filtrar por método" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os métodos</SelectItem>
            <SelectItem value="GET">GET</SelectItem>
            <SelectItem value="POST">POST</SelectItem>
            <SelectItem value="PUT">PUT</SelectItem>
            <SelectItem value="DELETE">DELETE</SelectItem>
            <SelectItem value="PATCH">PATCH</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="2xx">2xx (Sucesso)</SelectItem>
            <SelectItem value="4xx">4xx (Erro Cliente)</SelectItem>
            <SelectItem value="5xx">5xx (Erro Servidor)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Data/Hora
                </div>
              </TableHead>
              <TableHead>Usuário</TableHead>
              <TableHead>Método</TableHead>
              <TableHead>Endpoint</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-[150px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[100px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-[60px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[200px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-[50px]" />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Nenhum log encontrado
                </TableCell>
              </TableRow>
            ) : (
              filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-xs">{formatDate(log.dataHora)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{log.usuario}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`font-bold ${getMetodoColor(log.metodo)}`}>
                      {log.metodo}
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-xs max-w-[300px] truncate">
                    {log.endpoint}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeColor(log.status)}>{log.status}</Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
