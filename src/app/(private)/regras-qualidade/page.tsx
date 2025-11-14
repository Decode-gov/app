"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Target } from "lucide-react"
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
import { useColunas } from "@/hooks/api/use-colunas"
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
  const { data: colunasData } = useColunas({ page: 1, limit: 1000 })
  const { data: papeisData } = usePapeis({ page: 1, limit: 1000 })
  
  const deleteRegra = useDeleteRegraQualidade()

  const regras = regrasData?.data || []
  const dimensoes = dimensoesData?.data || []
  const tabelas = tabelasData?.data || []
  const colunas = colunasData?.data || []
  const papeis = papeisData?.data || []

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

        <div className="grid gap-4">
          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <div className="p-2 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors duration-300">
                <Target className="h-4 w-4 text-blue-600 transition-colors duration-300" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{regras.length || 0}</div>
              <p className="text-xs text-muted-foreground">regras cadastradas</p>
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
              <div className="relative flex-1 max-w-sm">
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

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Dimensão</TableHead>
                    <TableHead>Tabela</TableHead>
                    <TableHead>Coluna</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead className="w-[70px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Skeleton className="h-4 w-[250px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-[100px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-[100px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-[100px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-[100px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-8 w-8" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : error ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        Erro ao carregar regras. Tente novamente.
                      </TableCell>
                    </TableRow>
                  ) : regras.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        Nenhuma regra encontrada
                      </TableCell>
                    </TableRow>
                  ) : (
                    regras.map((regra: RegraQualidadeResponse) => {
                      const dimensao = regra.dimensao || dimensoes.find(d => d.id === regra.dimensaoId)
                      const tabela = regra.tabela || tabelas.find(t => t.id === regra.tabelaId)
                      const coluna = regra.coluna || colunas.find(c => c.id === regra.colunaId)
                      const responsavel = regra.responsavel || papeis.find(p => p.id === regra.responsavelId)

                      return (
                        <TableRow key={regra.id}>
                          <TableCell className="font-medium max-w-[300px]">
                            <div className="truncate" title={regra.descricao}>
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
                            {coluna ? (
                              <Badge variant="outline">{coluna.nome}</Badge>
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
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <RegraQualidadeForm open={isFormOpen} onOpenChange={setIsFormOpen} regra={selectedRegra} />
    </>
  )
}
