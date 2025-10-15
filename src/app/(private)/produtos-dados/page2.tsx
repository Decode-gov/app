"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Package, Database, FileText } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useProdutosDados, useDeleteProdutoDados } from "@/hooks/api/use-produtos-dados"
import { useComunidades } from "@/hooks/api/use-comunidades"
import { ProdutoDadosResponse } from "@/types/api"
import { ProdutoForm } from "@/components/produtos/produto-form"

export default function ProdutosDadosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [dominioFilter, setDominioFilter] = useState<string>("")
  const [page] = useState(1)
  const [limit] = useState(10)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedProduto, setSelectedProduto] = useState<ProdutoDadosResponse | undefined>()

  const queryParams: Record<string, string | number | undefined> = {
    page,
    limit,
    search: searchTerm || undefined,
  }
  
  if (dominioFilter) queryParams.dominioId = dominioFilter

  const { data: produtosData, isLoading, error } = useProdutosDados(queryParams)
  const { data: comunidadesData } = useComunidades({ page: 1, limit: 1000 })
  
  const deleteProduto = useDeleteProdutoDados()

  const handleEdit = (produto: ProdutoDadosResponse) => {
    setSelectedProduto(produto)
    setIsFormOpen(true)
  }

  const handleNew = () => {
    setSelectedProduto(undefined)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este produto de dados?")) {
      await deleteProduto.mutateAsync(id)
    }
  }

  const produtos = produtosData?.data || []
  const comunidades = comunidadesData?.data || []

  const produtosComDominio = produtos.filter(p => p.dominioId).length
  const produtosComPolitica = produtos.filter(p => p.politicaId).length
  const mediaTermos = produtos.length > 0 
    ? Math.round(produtos.reduce((acc, p) => acc + (p.termos?.length || 0), 0) / produtos.length)
    : 0

  return (
    <>
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Produtos de Dados
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie os produtos de dados do sistema DECODE-GOV
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <div className="p-2 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors duration-300">
                <Package className="h-4 w-4 text-blue-600 transition-colors duration-300" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{produtosData?.total || 0}</div>
              <p className="text-xs text-muted-foreground">produtos cadastrados</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Com Domínio</CardTitle>
              <div className="p-2 rounded-lg bg-green-100 group-hover:bg-green-200 transition-colors duration-300">
                <Database className="h-4 w-4 text-green-600 transition-colors duration-300" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{produtosComDominio}</div>
              <p className="text-xs text-muted-foreground">vinculados a domínios</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Com Política</CardTitle>
              <div className="p-2 rounded-lg bg-purple-100 group-hover:bg-purple-200 transition-colors duration-300">
                <FileText className="h-4 w-4 text-purple-600 transition-colors duration-300" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{produtosComPolitica}</div>
              <p className="text-xs text-muted-foreground">com política definida</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Média de Termos</CardTitle>
              <div className="p-2 rounded-lg bg-orange-100 group-hover:bg-orange-200 transition-colors duration-300">
                <FileText className="h-4 w-4 text-orange-600 transition-colors duration-300" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{mediaTermos}</div>
              <p className="text-xs text-muted-foreground">termos por produto</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Produtos de Dados</CardTitle>
                <CardDescription>
                  Lista de todos os produtos cadastrados
                </CardDescription>
              </div>
              <Button className="gap-2" onClick={handleNew}>
                <Plus className="h-4 w-4" />
                Novo Produto
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={dominioFilter || "todos"} onValueChange={(value) => setDominioFilter(value === "todos" ? "" : value)}>
                <SelectTrigger className="w-full md:w-[250px]">
                  <SelectValue placeholder="Filtrar por domínio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os domínios</SelectItem>
                  {comunidades.map((comunidade) => (
                    <SelectItem key={comunidade.id} value={comunidade.id}>
                      {comunidade.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <Skeleton className="h-[400px] w-full" />
            ) : error ? (
              <p className="text-center text-muted-foreground py-8">
                Erro ao carregar produtos. Tente novamente.
              </p>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Domínio</TableHead>
                      <TableHead>Termos</TableHead>
                      <TableHead>Ativos</TableHead>
                      <TableHead className="w-[70px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {produtos.map((produto: ProdutoDadosResponse) => {
                      const dominio = produto.dominioId ? comunidades.find(c => c.id === produto.dominioId) : null
                      const termosCount = produto.termos?.length || 0
                      const ativosCount = produto.ativos?.length || 0

                      return (
                        <TableRow key={produto.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4 text-blue-500" />
                              {produto.nome}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-[300px] truncate" title={produto.descricao}>
                              {produto.descricao}
                            </div>
                          </TableCell>
                          <TableCell>
                            {dominio ? (
                              <Badge variant="secondary">{dominio.nome}</Badge>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {termosCount > 0 ? (
                              <Badge variant="outline" className="bg-blue-50">
                                {termosCount} {termosCount === 1 ? 'termo' : 'termos'}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {ativosCount > 0 ? (
                              <Badge variant="outline" className="bg-green-50">
                                {ativosCount} {ativosCount === 1 ? 'ativo' : 'ativos'}
                              </Badge>
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
                                <DropdownMenuItem onClick={() => handleEdit(produto)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-destructive"
                                  onClick={() => handleDelete(produto.id)}
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

      <ProdutoForm open={isFormOpen} onOpenChange={setIsFormOpen} produto={selectedProduto} />
    </>
  )
}
