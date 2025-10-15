"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Target, CheckCircle2, Database } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRegrasQualidade, useDeleteRegraQualidade } from "@/hooks/api/use-regras-qualidade"
import { useDimensoesQualidade } from "@/hooks/api/use-dimensoes-qualidade-new"
import { useTabelas } from "@/hooks/api/use-tabelas"
import { usePapeis } from "@/hooks/api/use-papeis"
import { RegraQualidadeResponse } from "@/types/api"
import { RegraQualidadeForm } from "@/components/regras-qualidade/regra-qualidade-form"

export default function RegrasQualidadePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [dimensaoFilter, setDimensaoFilter] = useState<string>("")
  const [page] = useState(1)
  const [limit] = useState(10)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedRegra, setSelectedRegra] = useState<RegraQualidadeResponse | undefined>()

  const queryParams: Record<string, string | number | undefined> = {
    page,
    limit,
    search: searchTerm || undefined,
  }
  
  if (dimensaoFilter) queryParams.dimensaoId = dimensaoFilter

  const { data: regrasData, isLoading, error } = useRegrasQualidade(queryParams)
  const { data: dimensoesData } = useDimensoesQualidade({ page: 1, limit: 1000 })
  const { data: tabelasData } = useTabelas({ page: 1, limit: 1000 })
  const { data: papeisData } = usePapeis({ page: 1, limit: 1000 })
  
  const deleteRegra = useDeleteRegraQualidade()

  const handleEdit = (regra: RegraQualidadeResponse) => {
    setSelectedRegra(regra)
    setIsFormOpen(true)
  }

  const handleNew = () => {
    setSelectedRegra(undefined)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta regra de qualidade?")) {
      await deleteRegra.mutateAsync(id)
    }
  }

  const regras = regrasData?.data || []
  const dimensoes = dimensoesData?.data || []
  const tabelas = tabelasData?.data || []
  const papeis = papeisData?.data || []

  const regrasComTabela = regras.filter(r => r.tabelaId).length
  const regrasComResponsavel = regras.filter(r => r.responsavelId).length
  const dimensoesUnicas = [...new Set(regras.map(r => r.dimensaoId))].length

  return (
    <>
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Regras de Qualidade
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie as regras de qualidade de dados do sistema DECODE-GOV
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <div className="p-2 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors duration-300">
                <Target className="h-4 w-4 text-blue-600 transition-colors duration-300" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{regrasData?.total || 0}</div>
              <p className="text-xs text-muted-foreground">regras cadastradas</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dimensões</CardTitle>
              <div className="p-2 rounded-lg bg-green-100 group-hover:bg-green-200 transition-colors duration-300">
                <CheckCircle2 className="h-4 w-4 text-green-600 transition-colors duration-300" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{dimensoesUnicas}</div>
              <p className="text-xs text-muted-foreground">dimensões cobertas</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Com Tabela</CardTitle>
              <div className="p-2 rounded-lg bg-purple-100 group-hover:bg-purple-200 transition-colors duration-300">
                <Database className="h-4 w-4 text-purple-600 transition-colors duration-300" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{regrasComTabela}</div>
              <p className="text-xs text-muted-foreground">vinculadas a tabelas</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Com Responsável</CardTitle>
              <div className="p-2 rounded-lg bg-orange-100 group-hover:bg-orange-200 transition-colors duration-300">
                <CheckCircle2 className="h-4 w-4 text-orange-600 transition-colors duration-300" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{regrasComResponsavel}</div>
              <p className="text-xs text-muted-foreground">com responsável atribuído</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Regras de Qualidade</CardTitle>
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
              <Select value={dimensaoFilter || "todas"} onValueChange={(value) => setDimensaoFilter(value === "todas" ? "" : value)}>
                <SelectTrigger className="w-full md:w-[250px]">
                  <SelectValue placeholder="Filtrar por dimensão" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as dimensões</SelectItem>
                  {dimensoes.map((dimensao) => (
                    <SelectItem key={dimensao.id} value={dimensao.id}>
                      {dimensao.nome}
                    </SelectItem>
                  ))}
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
                      <TableHead>Descrição</TableHead>
                      <TableHead>Dimensão</TableHead>
                      <TableHead>Tabela</TableHead>
                      <TableHead>Responsável</TableHead>
                      <TableHead>Data de Criação</TableHead>
                      <TableHead className="w-[70px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {regras.map((regra: RegraQualidadeResponse) => {
                      const dimensao = dimensoes.find(d => d.id === regra.dimensaoId)
                      const tabela = regra.tabelaId ? tabelas.find(t => t.id === regra.tabelaId) : null
                      const responsavel = regra.responsavelId ? papeis.find(p => p.id === regra.responsavelId) : null

                      return (
                        <TableRow key={regra.id}>
                          <TableCell className="font-medium">
                            <div className="max-w-[300px] truncate" title={regra.descricao}>
                              {regra.descricao}
                            </div>
                          </TableCell>
                          <TableCell>
                            {dimensao ? (
                              <Badge variant="secondary">{dimensao.nome}</Badge>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {tabela ? (
                              <Badge variant="outline">{tabela.nome}</Badge>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {responsavel ? (
                              <Badge variant="outline">{responsavel.nome}</Badge>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
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

      <RegraQualidadeForm open={isFormOpen} onOpenChange={setIsFormOpen} regra={selectedRegra} />
    </>
  )
}
