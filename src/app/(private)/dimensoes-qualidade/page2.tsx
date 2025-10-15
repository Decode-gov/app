"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Target, Layers } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDimensoesQualidade, useDeleteDimensaoQualidade } from "@/hooks/api/use-dimensoes-qualidade-new"
import { usePoliticasInternas } from "@/hooks/api/use-politicas-internas"
import { DimensaoQualidadeResponse } from "@/types/api"
import { DimensaoQualidadeForm } from "@/components/dimensoes/dimensao-form"

export default function DimensoesQualidadePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [politicaFilter, setPoliticaFilter] = useState<string>("")
  const [page] = useState(1)
  const [limit] = useState(10)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedDimensao, setSelectedDimensao] = useState<DimensaoQualidadeResponse | undefined>()

  const queryParams: Record<string, string | number | undefined> = {
    page,
    limit,
    search: searchTerm || undefined,
  }
  
  if (politicaFilter) queryParams.politicaId = politicaFilter

  const { data: dimensoesData, isLoading, error } = useDimensoesQualidade(queryParams)
  const { data: politicasData } = usePoliticasInternas({ page: 1, limit: 1000 })
  
  const deleteDimensao = useDeleteDimensaoQualidade()

  const handleEdit = (dimensao: DimensaoQualidadeResponse) => {
    setSelectedDimensao(dimensao)
    setIsFormOpen(true)
  }

  const handleNew = () => {
    setSelectedDimensao(undefined)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta dimensão de qualidade?")) {
      await deleteDimensao.mutateAsync(id)
    }
  }

  const dimensoes = dimensoesData?.data || []
  const politicas = politicasData?.data || []

  const politicasUnicas = [...new Set(dimensoes.map(d => d.politicaId))].length

  return (
    <>
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Dimensões de Qualidade
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie as dimensões de qualidade de dados do sistema DECODE-GOV
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <div className="p-2 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors duration-300">
                <Target className="h-4 w-4 text-blue-600 transition-colors duration-300" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{dimensoesData?.total || 0}</div>
              <p className="text-xs text-muted-foreground">dimensões cadastradas</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Políticas</CardTitle>
              <div className="p-2 rounded-lg bg-green-100 group-hover:bg-green-200 transition-colors duration-300">
                <Layers className="h-4 w-4 text-green-600 transition-colors duration-300" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{politicasUnicas}</div>
              <p className="text-xs text-muted-foreground">políticas relacionadas</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Média por Política</CardTitle>
              <div className="p-2 rounded-lg bg-orange-100 group-hover:bg-orange-200 transition-colors duration-300">
                <Target className="h-4 w-4 text-orange-600 transition-colors duration-300" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {politicasUnicas > 0 ? Math.round((dimensoesData?.total || 0) / politicasUnicas) : 0}
              </div>
              <p className="text-xs text-muted-foreground">dimensões por política</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Dimensões de Qualidade</CardTitle>
                <CardDescription>
                  Lista de todas as dimensões cadastradas
                </CardDescription>
              </div>
              <Button className="gap-2" onClick={handleNew}>
                <Plus className="h-4 w-4" />
                Nova Dimensão
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar dimensões..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={politicaFilter || "todas"} onValueChange={(value) => setPoliticaFilter(value === "todas" ? "" : value)}>
                <SelectTrigger className="w-full md:w-[250px]">
                  <SelectValue placeholder="Filtrar por política" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as políticas</SelectItem>
                  {politicas.map((politica) => (
                    <SelectItem key={politica.id} value={politica.id}>
                      {politica.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <Skeleton className="h-[400px] w-full" />
            ) : error ? (
              <p className="text-center text-muted-foreground py-8">
                Erro ao carregar dimensões. Tente novamente.
              </p>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Política</TableHead>
                      <TableHead>Data de Criação</TableHead>
                      <TableHead className="w-[70px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dimensoes.map((dimensao: DimensaoQualidadeResponse) => {
                      const politica = politicas.find(p => p.id === dimensao.politicaId)

                      return (
                        <TableRow key={dimensao.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Target className="h-4 w-4 text-blue-500" />
                              {dimensao.nome}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-[400px] truncate" title={dimensao.descricao}>
                              {dimensao.descricao}
                            </div>
                          </TableCell>
                          <TableCell>
                            {politica ? (
                              <Badge variant="secondary">{politica.nome}</Badge>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(dimensao.createdAt).toLocaleDateString('pt-BR')}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEdit(dimensao)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-destructive"
                                  onClick={() => handleDelete(dimensao.id)}
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

      <DimensaoQualidadeForm open={isFormOpen} onOpenChange={setIsFormOpen} dimensao={selectedDimensao} />
    </>
  )
}
