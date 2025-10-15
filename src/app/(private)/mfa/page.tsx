"use client"

import { useState, useMemo } from "react"
import { Shield, Smartphone, Mail, Key, Search, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { useMfas } from "@/hooks/api/use-mfa"

// Helpers para labels e ícones
const getTipoIcon = (tipo: string) => {
  const icons: Record<string, typeof Smartphone> = {
    TOTP: Key,
    SMS: Smartphone,
    EMAIL: Mail,
  }
  return icons[tipo] || Shield
}

const getTipoLabel = (tipo: string) => {
  const labels: Record<string, string> = {
    TOTP: "Autenticador (TOTP)",
    SMS: "SMS",
    EMAIL: "E-mail",
  }
  return labels[tipo] || tipo
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    ATIVO: "Ativo",
    INATIVO: "Inativo",
  }
  return labels[status] || status
}

const getStatusBadgeColor = (status: string): "default" | "secondary" => {
  return status === "ATIVO" ? "default" : "secondary"
}

export default function MfaPage() {
  const [search, setSearch] = useState("")
  const [tipoFilter, setTipoFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Query
  const { data, isLoading } = useMfas({ page: 1, limit: 1000 })

  const configuracoes = data?.data ?? []

  // Stats
  const stats = useMemo(() => {
    return {
      total: configuracoes.length,
      ativos: configuracoes.filter((c) => c.status === "ATIVO").length,
      totp: configuracoes.filter((c) => c.tipo === "TOTP").length,
      sms: configuracoes.filter((c) => c.tipo === "SMS").length,
    }
  }, [configuracoes])

  // Filtros
  const filteredConfiguracoes = useMemo(() => {
    return configuracoes.filter((config) => {
      const matchesSearch =
        search === "" || config.usuarioId.toLowerCase().includes(search.toLowerCase())

      const matchesTipo = tipoFilter === "all" || config.tipo === tipoFilter

      const matchesStatus = statusFilter === "all" || config.status === statusFilter

      return matchesSearch && matchesTipo && matchesStatus
    })
  }, [configuracoes, search, tipoFilter, statusFilter])

  // Formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Autenticação Multifator (MFA)</h1>
          <p className="text-muted-foreground">
            Gerencie as configurações de autenticação multifator dos usuários
          </p>
        </div>
        <Button>
          <Shield className="mr-2 h-4 w-4" />
          Configurar MFA
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Configurações Totais</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MFA Ativo</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.ativos}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Autenticador (TOTP)</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totp}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SMS</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.sms}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por usuário..."
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
            <SelectItem value="TOTP">Autenticador (TOTP)</SelectItem>
            <SelectItem value="SMS">SMS</SelectItem>
            <SelectItem value="EMAIL">E-mail</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[150px]">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="ATIVO">Ativo</SelectItem>
            <SelectItem value="INATIVO">Inativo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuário</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Backup Codes</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead>Atualizado em</TableHead>
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
                    <Skeleton className="h-5 w-[120px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-[80px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[60px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[100px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[100px]" />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredConfiguracoes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Nenhuma configuração MFA encontrada
                </TableCell>
              </TableRow>
            ) : (
              filteredConfiguracoes.map((config) => {
                const TipoIcon = getTipoIcon(config.tipo)
                return (
                  <TableRow key={config.id}>
                    <TableCell className="font-medium">{config.usuarioId}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <TipoIcon className="h-4 w-4 text-muted-foreground" />
                        <span>{getTipoLabel(config.tipo)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeColor(config.status)}>
                        {config.status === "ATIVO" ? (
                          <CheckCircle className="mr-1 h-3 w-3" />
                        ) : (
                          <XCircle className="mr-1 h-3 w-3" />
                        )}
                        {getStatusLabel(config.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {config.backup_codes && config.backup_codes.length > 0 ? (
                        <Badge variant="outline" className="text-xs">
                          {config.backup_codes.length} códigos
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(config.createdAt)}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(config.updatedAt)}
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sobre MFA</CardTitle>
          <CardDescription>
            A autenticação multifator adiciona uma camada extra de segurança à sua conta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-start gap-2">
            <Key className="h-4 w-4 mt-0.5" />
            <div>
              <strong>Autenticador (TOTP):</strong> Use aplicativos como Google Authenticator ou
              Authy
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Smartphone className="h-4 w-4 mt-0.5" />
            <div>
              <strong>SMS:</strong> Receba códigos de verificação por mensagem de texto
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Mail className="h-4 w-4 mt-0.5" />
            <div>
              <strong>E-mail:</strong> Receba códigos de verificação por e-mail
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
