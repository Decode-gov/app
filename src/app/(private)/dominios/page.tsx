"use client"

import { useState } from "react"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Network } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import { useComunidades, useDeleteComunidade } from "@/hooks/api/use-comunidades"
import { ComunidadeForm } from "@/components/dominios/comunidade-form"
import { ComunidadeResponse } from "@/types/api"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function DominiosPage() {
  const [formOpen, setFormOpen] = useState(false)
  const [editingComunidade, setEditingComunidade] = useState<ComunidadeResponse | undefined>()
  const [search, setSearch] = useState("")

  const { data: comunidadesData, isLoading } = useComunidades()
  const deleteMutation = useDeleteComunidade()

  const comunidades = comunidadesData?.data || []

  const filteredComunidades = comunidades.filter((comunidade) => {
    const matchesSearch = 
      search === "" ||
      comunidade.nome.toLowerCase().includes(search.toLowerCase()) ||
      comunidade.descricao?.toLowerCase().includes(search.toLowerCase())
    
    return matchesSearch
  })

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

  return (
    <div className="space-y-6">
      {/* Stats Card */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Comunidades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{comunidades.length}</div>
            <p className="text-xs text-muted-foreground">
              {filteredComunidades.length} {filteredComunidades.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Comunidades Raiz
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getRootComunidades().length}</div>
            <p className="text-xs text-muted-foreground">
              Sem comunidade pai
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Domínios / Comunidades</CardTitle>
              <CardDescription>
                Gerencie as comunidades e sua hierarquia
              </CardDescription>
            </div>
            <Button onClick={handleNewComunidade}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Comunidade
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar comunidades..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-sm text-muted-foreground">Carregando...</p>
            </div>
          ) : filteredComunidades.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-sm text-muted-foreground">
                {search
                  ? "Nenhuma comunidade encontrada com os filtros aplicados."
                  : "Nenhuma comunidade cadastrada."}
              </p>
              {!search && (
                <Button onClick={handleNewComunidade} variant="outline" className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Cadastrar primeira comunidade
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Hierarquia</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead className="w-[70px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredComunidades.map((comunidade) => {
                    const parentNome = getParentNome(comunidade.parentId)
                    const hasChildren = getChildrenComunidades(comunidade.id).length > 0
                    
                    return (
                      <TableRow key={comunidade.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {comunidade.parentId && <span className="text-muted-foreground"></span>}
                            {comunidade.nome}
                            {hasChildren && (
                              <Badge variant="outline" className="text-xs">
                                <Network className="h-3 w-3 mr-1" />
                                Possui filhos
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
                        <TableCell>
                          <div className="max-w-[300px] truncate text-sm text-muted-foreground">
                            {comunidade.descricao || ""}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(comunidade.createdAt), "dd/MM/yyyy", { locale: ptBR })}
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
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <ComunidadeForm
        open={formOpen}
        onOpenChange={setFormOpen}
        comunidade={editingComunidade}
      />
    </div>
  )
}
