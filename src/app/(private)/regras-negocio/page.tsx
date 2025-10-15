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
import { Badge } from "@/components/ui/badge"
import { useRegrasNegocio, useDeleteRegraNegocio } from "@/hooks/api/use-regras-negocio"
import { useProcessos } from "@/hooks/api/use-processos"
import { RegraForm } from "@/components/regras/regra-form"
import { RegraNegocioResponse } from "@/types/api"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function RegrasNegocioPage() {
  const [formOpen, setFormOpen] = useState(false)
  const [editingRegra, setEditingRegra] = useState<RegraNegocioResponse | undefined>()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [tipoFilter, setTipoFilter] = useState<string>("all")

  const { data: regrasData, isLoading } = useRegrasNegocio()
  const { data: processosData } = useProcessos()
  const deleteMutation = useDeleteRegraNegocio()

  const regras = regrasData?.data || []
  const processos = processosData?.data || []

  const filteredRegras = regras.filter((regra) => {
    const matchesSearch = 
      search === "" ||
      regra.nome.toLowerCase().includes(search.toLowerCase()) ||
      regra.descricao?.toLowerCase().includes(search.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || regra.status === statusFilter
    const matchesTipo = tipoFilter === "all" || regra.tipoRegra === tipoFilter
    
    return matchesSearch && matchesStatus && matchesTipo
  })

  const handleEdit = (regra: RegraNegocioResponse) => {
    setEditingRegra(regra)
    setFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta regra de negócio?")) {
      try {
        await deleteMutation.mutateAsync(id)
      } catch (error) {
        console.error('Erro ao excluir regra de negócio:', error)
      }
    }
  }

  const handleNewRegra = () => {
    setEditingRegra(undefined)
    setFormOpen(true)
  }

  const getProcessoNome = (processoId: string) => {
    const processo = processos.find(p => p.id === processoId)
    return processo?.nome || "N/A"
  }

  const getStatusBadge = (status?: string) => {
    const statusMap = {
      ATIVA: { label: "Ativa", variant: "default" as const },
      INATIVA: { label: "Inativa", variant: "secondary" as const },
      EM_DESENVOLVIMENTO: { label: "Em Desenvolvimento", variant: "outline" as const },
      DESCONTINUADA: { label: "Descontinuada", variant: "destructive" as const },
    }
    const config = statusMap[status as keyof typeof statusMap] || { label: status || "", variant: "secondary" as const }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getTipoLabel = (tipo?: string) => {
    const tipoMap = {
      VALIDACAO: "Validação",
      TRANSFORMACAO: "Transformação",
      CALCULO: "Cálculo",
      CONTROLE: "Controle",
      NEGOCIO: "Negócio",
    }
    return tipoMap[tipo as keyof typeof tipoMap] || tipo || ""
  }

  return (
    <div className="space-y-6">
      {/* Stats Card */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Regras
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{regras.length}</div>
            <p className="text-xs text-muted-foreground">
              {filteredRegras.length} {filteredRegras.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Regras Ativas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {regras.filter(r => r.status === "ATIVA").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Em Desenvolvimento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {regras.filter(r => r.status === "EM_DESENVOLVIMENTO").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Regras de Negócio</CardTitle>
              <CardDescription>
                Gerencie as regras de negócio do sistema
              </CardDescription>
            </div>
            <Button onClick={handleNewRegra}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Regra
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar regras..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="ATIVA">Ativa</SelectItem>
                <SelectItem value="INATIVA">Inativa</SelectItem>
                <SelectItem value="EM_DESENVOLVIMENTO">Em Desenvolvimento</SelectItem>
                <SelectItem value="DESCONTINUADA">Descontinuada</SelectItem>
              </SelectContent>
            </Select>
            <Select value={tipoFilter} onValueChange={setTipoFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="VALIDACAO">Validação</SelectItem>
                <SelectItem value="TRANSFORMACAO">Transformação</SelectItem>
                <SelectItem value="CALCULO">Cálculo</SelectItem>
                <SelectItem value="CONTROLE">Controle</SelectItem>
                <SelectItem value="NEGOCIO">Negócio</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-sm text-muted-foreground">Carregando...</p>
            </div>
          ) : filteredRegras.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-sm text-muted-foreground">
                {search || statusFilter !== "all" || tipoFilter !== "all"
                  ? "Nenhuma regra encontrada com os filtros aplicados."
                  : "Nenhuma regra de negócio cadastrada."}
              </p>
              {!search && statusFilter === "all" && tipoFilter === "all" && (
                <Button onClick={handleNewRegra} variant="outline" className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Cadastrar primeira regra
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Processo</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead className="w-[70px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRegras.map((regra) => (
                    <TableRow key={regra.id}>
                      <TableCell className="font-medium">
                        <div>
                          {regra.nome}
                          <div className="max-w-[300px] truncate text-sm text-muted-foreground">
                            {regra.descricao}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{getTipoLabel(regra.tipoRegra)}</Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(regra.status)}</TableCell>
                      <TableCell>
                        <span className="text-sm">{getProcessoNome(regra.entidadeId)}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(regra.createdAt), "dd/MM/yyyy", { locale: ptBR })}
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
                            <DropdownMenuItem onClick={() => handleEdit(regra)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(regra.id)}
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

      <RegraForm
        open={formOpen}
        onOpenChange={setFormOpen}
        regra={editingRegra}
      />
    </div>
  )
}
