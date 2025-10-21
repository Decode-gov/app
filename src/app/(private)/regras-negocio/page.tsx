"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, FileText } from "lucide-react"
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useRegrasNegocio, useDeleteRegraNegocio } from "@/hooks/api/use-regras-negocio"
import { useProcessos } from "@/hooks/api/use-processos"
import { RegraForm } from "@/components/regras/regra-form"
import { RegraNegocioResponse } from "@/types/api"

const statusBadgeMap: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
  ATIVA: { variant: "default", label: "Ativa" },
  INATIVA: { variant: "secondary", label: "Inativa" },
  EM_DESENVOLVIMENTO: { variant: "outline", label: "Em Desenvolvimento" },
  DESCONTINUADA: { variant: "destructive", label: "Descontinuada" },
}

const tipoRegraLabels: Record<string, string> = {
  VALIDACAO: "Validação",
  TRANSFORMACAO: "Transformação",
  CALCULO: "Cálculo",
  CONTROLE: "Controle",
  NEGOCIO: "Negócio",
}

export default function RegrasNegocioPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [tipoFilter, setTipoFilter] = useState<string>("")
  const [formOpen, setFormOpen] = useState(false)
  const [selectedRegra, setSelectedRegra] = useState<RegraNegocioResponse | undefined>()

  const { data: regrasData, isLoading, error } = useRegrasNegocio({
    page: 1,
    limit: 1000,
    status: statusFilter || undefined,
    tipoRegra: tipoFilter || undefined,
  })
  const { data: processosData } = useProcessos({ page: 1, limit: 1000 })
  const deleteRegra = useDeleteRegraNegocio()

  // Extração do array de dados
  const regras = regrasData?.data ?? []
  const processos = processosData?.data ?? []

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta regra de negócio?")) {
      await deleteRegra.mutateAsync(id)
    }
  }

  const getProcessoNome = (processoId: string) => {
    const processo = processos.find(p => p.id === processoId)
    return processo?.nome || "N/A"
  }

  // Filtro local apenas para busca por texto
  const filteredData = regras.filter((regra) => {
    if (!search) return true
    const searchLower = search.toLowerCase()
    return (
      regra.descricao?.toLowerCase().includes(searchLower) ||
      getProcessoNome(regra.processoId).toLowerCase().includes(searchLower)
    )
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Regras de Negócio
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie as regras de negócio do sistema
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
            Regras de Negócio
          </h1>
          <p className="text-muted-foreground mt-2">
            Erro ao carregar regras de negócio
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Regras de Negócio
        </h1>
        <p className="text-muted-foreground mt-2">
          Gerencie as regras de negócio do sistema DECODE-GOV
        </p>
      </div>

      {/* Cards de estatísticas por Status */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativas</CardTitle>
            <div className="p-2 rounded-lg bg-green-100 group-hover:bg-green-200 transition-colors duration-300">
              <FileText className="h-4 w-4 text-green-600 transition-colors duration-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {regras.filter(r => r.status === "ATIVA").length}
            </div>
            <p className="text-xs text-muted-foreground">regras ativas</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Desenvolvimento</CardTitle>
            <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-slate-200 transition-colors duration-300">
              <FileText className="h-4 w-4 text-slate-600 transition-colors duration-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-700">
              {regras.filter(r => r.status === "EM_DESENVOLVIMENTO").length}
            </div>
            <p className="text-xs text-muted-foreground">em desenvolvimento</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Descontinuadas</CardTitle>
            <div className="p-2 rounded-lg bg-red-100 group-hover:bg-red-200 transition-colors duration-300">
              <FileText className="h-4 w-4 text-red-600 transition-colors duration-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {regras.filter(r => r.status === "DESCONTINUADA").length}
            </div>
            <p className="text-xs text-muted-foreground">descontinuadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de dados */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Regras de Negócio</CardTitle>
              <CardDescription>
                Lista de todas as regras de negócio cadastradas no sistema
              </CardDescription>
            </div>
            <Button className="gap-2" onClick={() => {
              setSelectedRegra(undefined)
              setFormOpen(true)
            }}>
              <Plus className="h-4 w-4" />
              Nova Regra
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar regras..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter || "ALL"} onValueChange={(value) => setStatusFilter(value === "ALL" ? "" : value)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos os status</SelectItem>
                <SelectItem value="ATIVA">Ativa</SelectItem>
                <SelectItem value="INATIVA">Inativa</SelectItem>
                <SelectItem value="EM_DESENVOLVIMENTO">Em Desenvolvimento</SelectItem>
                <SelectItem value="DESCONTINUADA">Descontinuada</SelectItem>
              </SelectContent>
            </Select>
            <Select value={tipoFilter || "ALL"} onValueChange={(value) => setTipoFilter(value === "ALL" ? "" : value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos os tipos</SelectItem>
                <SelectItem value="VALIDACAO">Validação</SelectItem>
                <SelectItem value="TRANSFORMACAO">Transformação</SelectItem>
                <SelectItem value="CALCULO">Cálculo</SelectItem>
                <SelectItem value="CONTROLE">Controle</SelectItem>
                <SelectItem value="NEGOCIO">Negócio</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Processo</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead className="w-[70px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      Nenhuma regra de negócio encontrada
                    </TableCell>
                  </TableRow>
                ) : filteredData?.map((regra) => (
                  <TableRow key={regra.id}>
                    <TableCell className="font-medium">
                      <div className="max-w-[300px] truncate" title={regra.descricao}>
                        {regra.descricao}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{tipoRegraLabels[regra.tipoRegra as keyof typeof tipoRegraLabels]}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusBadgeMap[regra.status as keyof typeof statusBadgeMap]?.variant || 'outline'}>
                        {statusBadgeMap[regra.status as keyof typeof statusBadgeMap]?.label || regra.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      <div className="max-w-[150px] truncate" title={getProcessoNome(regra.processoId)}>
                        {getProcessoNome(regra.processoId)}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(regra.createdAt).toLocaleDateString('pt-BR')}
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
                            setSelectedRegra(regra)
                            setFormOpen(true)
                          }}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDelete(regra.id)}
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
      <RegraForm 
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open)
          if (!open) {
            setSelectedRegra(undefined)
          }
        }}
        regra={selectedRegra}
      />
    </div>
  )
}
