"use client"

import { useState } from "react"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Network, Eye } from "lucide-react"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { Badge } from "@/components/ui/badge"
import { useComunidades, useDeleteComunidade } from "@/hooks/api/use-comunidades"
import { ComunidadeForm } from "@/components/dominios/comunidade-form"
import { ComunidadeResponse } from "@/types/api"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function DominiosPage() {
  const [formOpen, setFormOpen] = useState(false)
  const [editingComunidade, setEditingComunidade] = useState<ComunidadeResponse | undefined>()
  const [searchTerm, setSearchTerm] = useState("")
  const [parentFilter, setParentFilter] = useState<string>("")

  // Filtros server-side via query params
  const { data: comunidadesData, isLoading, error } = useComunidades({
    page: 1,
    limit: 1000,
    nome: searchTerm || undefined,
    parentId: parentFilter && parentFilter !== "ROOT" ? parentFilter : undefined,
  })
  const deleteMutation = useDeleteComunidade()

  const comunidades = comunidadesData?.data || []
  
  // Se filtro ROOT está ativo, filtrar apenas comunidades sem pai (client-side)
  const filteredComunidades = parentFilter === "ROOT" 
    ? comunidades.filter(c => !c.parentId)
    : comunidades

  const handleEdit = (comunidade: ComunidadeResponse) => {
    setEditingComunidade(comunidade)
    setFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta comunidade?")) {
      try {
        await deleteMutation.mutateAsync(id)
      } catch (error) {
        console.error('Erro ao excluir comunidade:', error)
      }
    }
  }

  const handleNewComunidade = () => {
    setEditingComunidade(undefined)
    setFormOpen(true)
  }

  const getParentNome = (parentId?: string) => {
    if (!parentId) return null
    const parent = comunidades.find(c => c.id === parentId)
    return parent?.nome
  }

  const getRootComunidades = () => {
    return filteredComunidades.filter(c => !c.parentId)
  }

  const getChildrenComunidades = (parentId: string) => {
    return filteredComunidades.filter(c => c.parentId === parentId)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Domínios / Comunidades
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie as comunidades e sua hierarquia de governança de dados
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-[100px] bg-muted rounded" />
                <div className="h-8 w-8 bg-muted rounded-lg" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-[60px] bg-muted rounded mb-2" />
                <div className="h-3 w-[120px] bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardContent className="space-y-4 pt-6">
            <div className="flex items-center gap-2">
              <div className="h-10 w-[300px] bg-muted rounded" />
              <div className="h-10 w-[200px] bg-muted rounded" />
            </div>
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 w-full bg-muted rounded" />
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
            Domínios / Comunidades
          </h1>
          <p className="text-muted-foreground mt-2">
            Erro ao carregar comunidades
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Domínios / Comunidades
        </h1>
        <p className="text-muted-foreground mt-2">
          Gerencie as comunidades e sua hierarquia de governança de dados
        </p>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Comunidades</CardTitle>
            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
              <Network className="h-4 w-4 text-primary transition-colors duration-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{comunidades.length}</div>
            <p className="text-xs text-muted-foreground">
              {filteredComunidades.length} {filteredComunidades.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
            </p>
          </CardContent>
        </Card>
        
        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comunidades Raiz</CardTitle>
            <div className="p-2 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors duration-300">
              <Network className="h-4 w-4 text-blue-600 transition-colors duration-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{getRootComunidades().length}</div>
            <p className="text-xs text-muted-foreground">Sem comunidade pai</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de dados */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Domínios / Comunidades</CardTitle>
              <CardDescription>
                Lista de todas as comunidades cadastradas
              </CardDescription>
            </div>
            <Button className="gap-2" onClick={handleNewComunidade}>
              <Plus className="h-4 w-4" />
              Nova Comunidade
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar comunidades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select
              value={parentFilter || "ALL"}
              onValueChange={(value) => setParentFilter(value === "ALL" ? "" : value)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filtrar por hierarquia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todas as hierarquias</SelectItem>
                <SelectItem value="ROOT">Apenas raiz (sem pai)</SelectItem>
                {comunidades
                  .filter(c => !c.parentId)
                  .map((parent) => (
                    <SelectItem key={parent.id} value={parent.id}>
                      {parent.nome}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Hierarquia</TableHead>
                  <TableHead className="text-center">Papéis</TableHead>
                  <TableHead className="text-center">KPIs</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead className="w-[70px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredComunidades.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      Nenhuma comunidade encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredComunidades.map((comunidade) => {
                    const parentNome = getParentNome(comunidade.parentId)
                    const hasChildren = getChildrenComunidades(comunidade.id).length > 0
                    const papeisCount = comunidade._count?.papeis || 0
                    const kpisCount = comunidade._count?.kpis || 0
                    
                    return (
                      <TableRow key={comunidade.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2 max-w-[200px]">
                            {comunidade.nome}
                            {hasChildren && (
                              <Badge variant="outline" className="text-xs">
                                <Network className="h-3 w-3 mr-1" />
                                {comunidade._count?.children || 0}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {parentNome ? (
                            <Badge variant="secondary" className="text-xs">
                              {parentNome}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">Raiz</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary" className="text-xs">
                            {papeisCount}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary" className="text-xs">
                            {kpisCount}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(new Date(comunidade.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                Ver detalhes
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEdit(comunidade)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(comunidade.id)}
                                className="text-destructive"
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

      {/* Formulário de Criação/Edição */}
      <ComunidadeForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open)
          if (!open) {
            setEditingComunidade(undefined)
          }
        }}
        comunidade={editingComunidade}
      />
    </div>
  )
}
