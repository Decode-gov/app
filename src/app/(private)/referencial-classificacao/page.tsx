"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Shield } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { useListasClassificacao, useDeleteListaClassificacao } from "@/hooks/api/use-listas-classificacao"
import { usePoliticasInternas } from "@/hooks/api/use-politicas-internas"
import { ListaClassificacaoResponse } from "@/types/api"
import { ReferencialForm } from "@/components/referencial/referencial-form"

const CATEGORIA_CONFIG = {
  Publico: { label: "Público", color: "bg-green-500" },
  Interno: { label: "Interno", color: "bg-blue-500" },
  Confidencial: { label: "Confidencial", color: "bg-orange-500" },
  Restrito: { label: "Restrito", color: "bg-red-500" },
}

export default function ReferencialClassificacaoPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoriaFilter, setCategoriaFilter] = useState<string>("all")
  const [politicaFilter, setPoliticaFilter] = useState<string>("all")
  const [page] = useState(1)
  const [limit] = useState(10)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedReferencial, setSelectedReferencial] = useState<ListaClassificacaoResponse | undefined>()

  const queryParams: Record<string, string | number | boolean | undefined> = {
    page,
    limit,
    search: searchTerm || undefined,
  }
  
  if (categoriaFilter && categoriaFilter !== "all") queryParams.categoria = categoriaFilter
  if (politicaFilter && politicaFilter !== "all") queryParams.politicaId = politicaFilter

  const { data: referenciaisData, isLoading, error } = useListasClassificacao(queryParams)
  const { data: politicasData } = usePoliticasInternas()
  const deleteReferencial = useDeleteListaClassificacao()
  
  const politicas = politicasData?.data || []

  const handleEdit = (referencial: ListaClassificacaoResponse) => {
    setSelectedReferencial(referencial)
    setIsFormOpen(true)
  }

  const handleNew = () => {
    setSelectedReferencial(undefined)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este referencial de classificação?")) {
      await deleteReferencial.mutateAsync(id)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Referencial de Classificação
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie os referenciais de classificação de informação
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-20" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-24" />
              </CardContent>
            </Card>
          ))}
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
            Referencial de Classificação
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie os referenciais de classificação de informação
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

  const referenciais = referenciaisData?.data || []
  const publicos = referenciais.filter(r => r.categoria === "Publico")
  const internos = referenciais.filter(r => r.categoria === "Interno")
  const confidenciais = referenciais.filter(r => r.categoria === "Confidencial")
  const restritos = referenciais.filter(r => r.categoria === "Restrito")

  return (
    <>
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Referencial de Classificação
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie os referenciais de classificação de informação do sistema DECODE-GOV
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Público</CardTitle>
              <div className="p-2 rounded-lg bg-green-100 group-hover:bg-green-200 transition-colors duration-300">
                <Shield className="h-4 w-4 text-green-600 transition-colors duration-300" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{publicos.length}</div>
              <p className="text-xs text-muted-foreground">classificações públicas</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Interno</CardTitle>
              <div className="p-2 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors duration-300">
                <Shield className="h-4 w-4 text-blue-600 transition-colors duration-300" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{internos.length}</div>
              <p className="text-xs text-muted-foreground">classificações internas</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confidencial</CardTitle>
              <div className="p-2 rounded-lg bg-orange-100 group-hover:bg-orange-200 transition-colors duration-300">
                <Shield className="h-4 w-4 text-orange-600 transition-colors duration-300" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{confidenciais.length}</div>
              <p className="text-xs text-muted-foreground">classificações confidenciais</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Restrito</CardTitle>
              <div className="p-2 rounded-lg bg-red-100 group-hover:bg-red-200 transition-colors duration-300">
                <Shield className="h-4 w-4 text-red-600 transition-colors duration-300" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{restritos.length}</div>
              <p className="text-xs text-muted-foreground">classificações restritas</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Referenciais de Classificação</CardTitle>
                <CardDescription>
                  Lista de todos os referenciais de classificação cadastrados no sistema
                </CardDescription>
              </div>
              <Button className="gap-2" onClick={handleNew}>
                <Plus className="h-4 w-4" />
                Novo Referencial
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar referenciais..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={categoriaFilter} onValueChange={setCategoriaFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filtrar por categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  <SelectItem value="Publico">Público</SelectItem>
                  <SelectItem value="Interno">Interno</SelectItem>
                  <SelectItem value="Confidencial">Confidencial</SelectItem>
                  <SelectItem value="Restrito">Restrito</SelectItem>
                </SelectContent>
              </Select>
              {politicas && politicas.length > 0 && (
                <Select value={politicaFilter} onValueChange={setPoliticaFilter}>
                  <SelectTrigger className="w-[220px]">
                    <SelectValue placeholder="Filtrar por política" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as políticas</SelectItem>
                    {politicas.map(politica => (
                      <SelectItem key={politica.id} value={politica.id}>
                        {politica.nome}
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
                    <TableHead>Categoria</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Política</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead className="w-[70px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {referenciais.map((referencial: ListaClassificacaoResponse) => (
                    <TableRow key={referencial.id}>
                      <TableCell>
                        <Badge className={`${CATEGORIA_CONFIG[referencial.categoria].color} text-white`}>
                          {CATEGORIA_CONFIG[referencial.categoria].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[400px] truncate" title={referencial.descricao}>
                          {referencial.descricao}
                        </div>
                      </TableCell>
                      <TableCell>
                        {politicas ? (
                          <Badge variant="outline">
                            {politicas.find(p => p.id === referencial.politicaId)?.nome || "N/A"}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(referencial.createdAt).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(referencial)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => handleDelete(referencial.id)}
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

      <ReferencialForm open={isFormOpen} onOpenChange={setIsFormOpen} referencial={selectedReferencial} />
    </>
  )
}
