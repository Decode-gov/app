"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Search, MoreHorizontal, Edit, Trash2, FileText } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { useClassificacoes, useDeleteClassificacao } from "@/hooks/api/use-classificacoes-informacao"
import { useListasClassificacao } from "@/hooks/api/use-listas-classificacao"
import { ClassificacaoInformacaoResponse } from "@/types/api"
import { ClassificacaoInfoForm } from "@/components/classificacoes-info/classificacao-info-form"

export default function ClassificacoesInformacaoPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [listaFilter, setListaFilter] = useState<string>("")
  const [page] = useState(1)
  const [limit] = useState(10)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedClassificacao, setSelectedClassificacao] = useState<ClassificacaoInformacaoResponse | undefined>()

  const queryParams: Record<string, string | number | boolean | undefined> = {
    page,
    limit,
    search: searchTerm || undefined,
  }
  
  if (listaFilter && listaFilter !== "all") queryParams.classificacaoId = listaFilter

  const { data: classificacoesData, isLoading, error } = useClassificacoes(queryParams)
  const { data: listasData } = useListasClassificacao()

  const deleteClassificacao = useDeleteClassificacao()

  const handleEdit = (classificacao: ClassificacaoInformacaoResponse) => {
    setSelectedClassificacao(classificacao)
    setIsFormOpen(true)
  }

  const handleNew = () => {
    setSelectedClassificacao(undefined)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta classificação?")) {
      await deleteClassificacao.mutateAsync(id)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Classificação dos termos de negócio
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie as classificações dos termos de negócio
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-1">
          <Card>
            <CardHeader>
              <Skeleton className="h-4 w-20" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-[400px] w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Classificação dos termos de negócio
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie as classificações dos termos de negócio
          </p>
        </div>
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">
              Erro ao carregar dados. Tente novamente.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const classificacoes = classificacoesData?.data || []
  const listas = listasData?.data || []
  
  const totalClassificacoes = classificacoes.length

  return (
    <>
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Classificação dos termos de negócio
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie as classificações dos termos de negócio
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-1">
          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Classificações</CardTitle>
              <div className="p-2 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors duration-300">
                <FileText className="h-4 w-4 text-accent group-hover:text-accent-foreground transition-colors duration-300" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalClassificacoes}</div>
              <p className="text-xs text-muted-foreground">classificações cadastradas</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Classificação dos termos de negócio</CardTitle>
                <CardDescription>
                  Lista de todas as classificações cadastradas
                </CardDescription>
              </div>
              <Button className="gap-2" onClick={handleNew}>
                <Plus className="h-4 w-4" />
                Nova Classificação
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar classificações..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              {listas && listas.length > 0 && (
                <Select value={listaFilter || "all"} onValueChange={setListaFilter}>
                  <SelectTrigger className="w-[220px]">
                    <SelectValue placeholder="Filtrar por tipologia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as tipologias</SelectItem>
                    {listas.map(lista => (
                      <SelectItem key={lista.id} value={lista.id}>
                        {lista.classificacao}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lista de Classificação</TableHead>
                    <TableHead>Termo Associado</TableHead>
                    <TableHead>Política</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead className="w-[70px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classificacoes.map((classificacao: ClassificacaoInformacaoResponse) => (
                    <TableRow key={classificacao.id}>
                      <TableCell className="font-medium">
                        {classificacao.classificacao ? (
                          <div className="flex flex-col gap-1">
                            <span>{classificacao.classificacao.classificacao}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {classificacao.termo ? (
                          <div className="flex flex-col gap-1">
                            {classificacao.termo.termo}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {classificacao.classificacao?.politica ? (
                          <span>{classificacao.classificacao.politica.nome}</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(classificacao.createdAt).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(classificacao)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => handleDelete(classificacao.id)}
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
      </div>

      <ClassificacaoInfoForm open={isFormOpen} onOpenChange={setIsFormOpen} classificacao={selectedClassificacao} />
    </>
  )
}
