"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Users, Building2, UserCheck } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { usePartesEnvolvidas, useDeleteParteEnvolvida } from "@/hooks/api/use-partes-envolvidas"
import { usePapeis } from "@/hooks/api/use-papeis"
import { ParteEnvolvidaResponse } from "@/types/api"
import { ParteEnvolvidaForm } from "@/components/partes-envolvidas/parte-envolvida-form"

const getTipoLabel = (tipo: string) => {
  const labels: Record<string, string> = {
    PESSOA_FISICA: "Pessoa Física",
    PESSOA_JURIDICA: "Pessoa Jurídica",
    ORGAO_PUBLICO: "Órgão Público",
    ENTIDADE_EXTERNA: "Entidade Externa",
  }
  return labels[tipo] || tipo
}

const getTipoBadgeColor = (tipo: string) => {
  const colors: Record<string, string> = {
    PESSOA_FISICA: "bg-blue-100 text-blue-800",
    PESSOA_JURIDICA: "bg-green-100 text-green-800",
    ORGAO_PUBLICO: "bg-purple-100 text-purple-800",
    ENTIDADE_EXTERNA: "bg-orange-100 text-orange-800",
  }
  return colors[tipo] || "bg-gray-100 text-gray-800"
}

export default function PartesEnvolvidasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [tipoFilter, setTipoFilter] = useState<string>("")
  const [page] = useState(1)
  const [limit] = useState(10)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedParte, setSelectedParte] = useState<ParteEnvolvidaResponse | undefined>()

  const queryParams: Record<string, string | number | undefined> = {
    page,
    limit,
    search: searchTerm || undefined,
  }
  
  if (tipoFilter) queryParams.tipo = tipoFilter

  const { data: partesData, isLoading, error } = usePartesEnvolvidas(queryParams)
  const { data: papeisData } = usePapeis({ page: 1, limit: 1000 })
  
  const deleteParte = useDeleteParteEnvolvida()

  const handleEdit = (parte: ParteEnvolvidaResponse) => {
    setSelectedParte(parte)
    setIsFormOpen(true)
  }

  const handleNew = () => {
    setSelectedParte(undefined)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta parte envolvida?")) {
      await deleteParte.mutateAsync(id)
    }
  }

  const partes = partesData?.data || []
  const papeis = papeisData?.data || []

  const pessoasFisicas = partes.filter(p => p.tipo === 'PESSOA_FISICA').length
  const pessoasJuridicas = partes.filter(p => p.tipo === 'PESSOA_JURIDICA').length
  const partesComPapel = partes.filter(p => p.papelId).length

  return (
    <>
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Partes Envolvidas
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie as partes envolvidas no sistema DECODE-GOV
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <div className="p-2 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors duration-300">
                <Users className="h-4 w-4 text-blue-600 transition-colors duration-300" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{partesData?.total || 0}</div>
              <p className="text-xs text-muted-foreground">partes cadastradas</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pessoas Físicas</CardTitle>
              <div className="p-2 rounded-lg bg-green-100 group-hover:bg-green-200 transition-colors duration-300">
                <UserCheck className="h-4 w-4 text-green-600 transition-colors duration-300" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{pessoasFisicas}</div>
              <p className="text-xs text-muted-foreground">pessoas físicas</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pessoas Jurídicas</CardTitle>
              <div className="p-2 rounded-lg bg-purple-100 group-hover:bg-purple-200 transition-colors duration-300">
                <Building2 className="h-4 w-4 text-purple-600 transition-colors duration-300" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{pessoasJuridicas}</div>
              <p className="text-xs text-muted-foreground">pessoas jurídicas</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Com Papel</CardTitle>
              <div className="p-2 rounded-lg bg-orange-100 group-hover:bg-orange-200 transition-colors duration-300">
                <UserCheck className="h-4 w-4 text-orange-600 transition-colors duration-300" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{partesComPapel}</div>
              <p className="text-xs text-muted-foreground">com papel atribuído</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Partes Envolvidas</CardTitle>
                <CardDescription>
                  Lista de todas as partes envolvidas cadastradas
                </CardDescription>
              </div>
              <Button className="gap-2" onClick={handleNew}>
                <Plus className="h-4 w-4" />
                Nova Parte
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar partes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={tipoFilter || "todos"} onValueChange={(value) => setTipoFilter(value === "todos" ? "" : value)}>
                <SelectTrigger className="w-full md:w-[250px]">
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os tipos</SelectItem>
                  <SelectItem value="PESSOA_FISICA">Pessoa Física</SelectItem>
                  <SelectItem value="PESSOA_JURIDICA">Pessoa Jurídica</SelectItem>
                  <SelectItem value="ORGAO_PUBLICO">Órgão Público</SelectItem>
                  <SelectItem value="ENTIDADE_EXTERNA">Entidade Externa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <Skeleton className="h-[400px] w-full" />
            ) : error ? (
              <p className="text-center text-muted-foreground py-8">
                Erro ao carregar partes envolvidas. Tente novamente.
              </p>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Contato</TableHead>
                      <TableHead>Papel</TableHead>
                      <TableHead>Data de Criação</TableHead>
                      <TableHead className="w-[70px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {partes.map((parte: ParteEnvolvidaResponse) => {
                      const papel = parte.papelId ? papeis.find(p => p.id === parte.papelId) : null

                      return (
                        <TableRow key={parte.id}>
                          <TableCell className="font-medium">
                            {parte.nome}
                          </TableCell>
                          <TableCell>
                            <Badge className={getTipoBadgeColor(parte.tipo)}>
                              {getTipoLabel(parte.tipo)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {parte.contato || <span className="text-muted-foreground">-</span>}
                          </TableCell>
                          <TableCell>
                            {papel ? (
                              <Badge variant="secondary">{papel.nome}</Badge>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(parte.createdAt).toLocaleDateString('pt-BR')}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEdit(parte)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-destructive"
                                  onClick={() => handleDelete(parte.id)}
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

      <ParteEnvolvidaForm open={isFormOpen} onOpenChange={setIsFormOpen} parte={selectedParte} />
    </>
  )
}
