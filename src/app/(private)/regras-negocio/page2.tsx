"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Search, MoreHorizontal, Edit, Trash2, FileText, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRegrasNegocio, useDeleteRegraNegocio } from "@/hooks/api/use-regras-negocio"
import { usePoliticasInternas } from "@/hooks/api/use-politicas-internas"
import { RegraNegocioResponse } from "@/types/api"
import { RegraNegocioForm } from "@/components/regras/regra-negocio-form"

const getStatusColor = (status?: string) => {
  switch (status) {
    case 'ATIVA': return 'bg-green-100 text-green-800'
    case 'INATIVA': return 'bg-gray-100 text-gray-800'
    case 'EM_DESENVOLVIMENTO': return 'bg-blue-100 text-blue-800'
    case 'DESCONTINUADA': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getStatusLabel = (status?: string) => {
  switch (status) {
    case 'ATIVA': return 'Ativa'
    case 'INATIVA': return 'Inativa'
    case 'EM_DESENVOLVIMENTO': return 'Em Desenvolvimento'
    case 'DESCONTINUADA': return 'Descontinuada'
    default: return '-'
  }
}

const getTipoRegraLabel = (tipo?: string) => {
  switch (tipo) {
    case 'VALIDACAO': return 'Validação'
    case 'TRANSFORMACAO': return 'Transformação'
    case 'CALCULO': return 'Cálculo'
    case 'CONTROLE': return 'Controle'
    case 'NEGOCIO': return 'Negócio'
    default: return '-'
  }
}

const getEntidadeTipoLabel = (tipo: string) => {
  switch (tipo) {
    case 'Politica': return 'Política'
    case 'Papel': return 'Papel'
    case 'Atribuicao': return 'Atribuição'
    case 'Processo': return 'Processo'
    case 'Termo': return 'Termo'
    case 'KPI': return 'KPI'
    case 'RegraNegocio': return 'Regra de Negócio'
    case 'RegraQualidade': return 'Regra de Qualidade'
    case 'Dominio': return 'Domínio'
    case 'Sistema': return 'Sistema'
    case 'Tabela': return 'Tabela'
    case 'Coluna': return 'Coluna'
    default: return tipo
  }
}

export default function RegrasNegocioPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [tipoRegraFilter, setTipoRegraFilter] = useState<string>("")
  const [page] = useState(1)
  const [limit] = useState(10)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedRegra, setSelectedRegra] = useState<RegraNegocioResponse | undefined>()

  const queryParams: Record<string, string | number | undefined> = {
    page,
    limit,
    search: searchTerm || undefined,
  }
  
  if (statusFilter) queryParams.status = statusFilter
  if (tipoRegraFilter) queryParams.tipoRegra = tipoRegraFilter

  const { data: regrasData, isLoading, error } = useRegrasNegocio(queryParams)
  const { data: politicasData } = usePoliticasInternas({ page: 1, limit: 1000 })
  
  const deleteRegra = useDeleteRegraNegocio()

  const handleEdit = (regra: RegraNegocioResponse) => {
    setSelectedRegra(regra)
    setIsFormOpen(true)
  }

  const handleNew = () => {
    setSelectedRegra(undefined)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta regra de negócio?")) {
      await deleteRegra.mutateAsync(id)
    }
  }

  const regras = regrasData?.data || []
  const politicas = politicasData?.data || []

  const regrasAtivas = regras.filter(r => r.status === 'ATIVA').length
  const regrasEmDesenvolvimento = regras.filter(r => r.status === 'EM_DESENVOLVIMENTO').length
  const tiposUnicos = [...new Set(regras.map(r => r.entidadeTipo))].length

  return (
    <>
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Regras de Negócio
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie as regras de negócio do sistema DECODE-GOV
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <div className="p-2 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors duration-300">
                <FileText className="h-4 w-4 text-blue-600 transition-colors duration-300" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{regrasData?.total || 0}</div>
              <p className="text-xs text-muted-foreground">regras cadastradas</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ativas</CardTitle>
              <div className="p-2 rounded-lg bg-green-100 group-hover:bg-green-200 transition-colors duration-300">
                <CheckCircle2 className="h-4 w-4 text-green-600 transition-colors duration-300" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{regrasAtivas}</div>
              <p className="text-xs text-muted-foreground">regras ativas</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Desenvolvimento</CardTitle>
              <div className="p-2 rounded-lg bg-orange-100 group-hover:bg-orange-200 transition-colors duration-300">
                <FileText className="h-4 w-4 text-orange-600 transition-colors duration-300" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{regrasEmDesenvolvimento}</div>
              <p className="text-xs text-muted-foreground">em desenvolvimento</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tipos de Entidade</CardTitle>
              <div className="p-2 rounded-lg bg-purple-100 group-hover:bg-purple-200 transition-colors duration-300">
                <FileText className="h-4 w-4 text-purple-600 transition-colors duration-300" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{tiposUnicos}</div>
              <p className="text-xs text-muted-foreground">tipos diferentes</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Regras de Negócio</CardTitle>
                <CardDescription>
                  Lista de todas as regras cadastradas
                </CardDescription>
              </div>
              <Button className="gap-2" onClick={handleNew}>
                <Plus className="h-4 w-4" />
                Nova Regra
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar regras..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={statusFilter || "todos"} onValueChange={(value) => setStatusFilter(value === "todos" ? "" : value)}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os status</SelectItem>
                  <SelectItem value="ATIVA">Ativa</SelectItem>
                  <SelectItem value="INATIVA">Inativa</SelectItem>
                  <SelectItem value="EM_DESENVOLVIMENTO">Em Desenvolvimento</SelectItem>
                  <SelectItem value="DESCONTINUADA">Descontinuada</SelectItem>
                </SelectContent>
              </Select>
              <Select value={tipoRegraFilter || "todos"} onValueChange={(value) => setTipoRegraFilter(value === "todos" ? "" : value)}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os tipos</SelectItem>
                  <SelectItem value="VALIDACAO">Validação</SelectItem>
                  <SelectItem value="TRANSFORMACAO">Transformação</SelectItem>
                  <SelectItem value="CALCULO">Cálculo</SelectItem>
                  <SelectItem value="CONTROLE">Controle</SelectItem>
                  <SelectItem value="NEGOCIO">Negócio</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <Skeleton className="h-[400px] w-full" />
            ) : error ? (
              <p className="text-center text-muted-foreground py-8">
                Erro ao carregar regras. Tente novamente.
              </p>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Tipo Entidade</TableHead>
                      <TableHead>Política</TableHead>
                      <TableHead>Tipo Regra</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[70px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {regras.map((regra: RegraNegocioResponse) => {
                      const politica = politicas.find(p => p.id === regra.politicaId)

                      return (
                        <TableRow key={regra.id}>
                          <TableCell className="font-medium">
                            <div className="space-y-1">
                              <div>{regra.nome}</div>
                              <div className="text-xs text-muted-foreground max-w-[300px] truncate">
                                {regra.descricao}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{getEntidadeTipoLabel(regra.entidadeTipo)}</Badge>
                          </TableCell>
                          <TableCell>
                            {politica ? (
                              <Badge variant="secondary">{politica.nome}</Badge>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {getTipoRegraLabel(regra.tipoRegra)}
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(regra.status)}>
                              {getStatusLabel(regra.status)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEdit(regra)}>
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
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <RegraNegocioForm open={isFormOpen} onOpenChange={setIsFormOpen} regra={selectedRegra} />
    </>
  )
}
