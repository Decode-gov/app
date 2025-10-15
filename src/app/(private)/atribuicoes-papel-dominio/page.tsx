"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Workflow } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { useAtribuicoes, useDeleteAtribuicao } from "@/hooks/api/use-atribuicoes"
import { useComunidades } from "@/hooks/api/use-comunidades"
import { usePapeis } from "@/hooks/api/use-papeis"
import { AtribuicaoForm } from "@/components/atribuicoes/atribuicao-form"
import { AtribuicaoResponse } from "@/types/api"

export default function AtribuicoesPapelDominioPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [dominioFilter, setDominioFilter] = useState<string>("all")
  const [papelFilter, setPapelFilter] = useState<string>("all")
  const [formOpen, setFormOpen] = useState(false)
  const [editingAtribuicao, setEditingAtribuicao] = useState<AtribuicaoResponse | undefined>()

  const { data: atribuicoesData, isLoading, error } = useAtribuicoes()
  const { data: dominiosData } = useComunidades()
  const { data: papeisData } = usePapeis()
  const deleteAtribuicao = useDeleteAtribuicao()

  // Filtrar atribuições
  const filteredAtribuicoes = atribuicoesData?.data?.filter((atribuicao) => {
    const matchesSearch =
      atribuicao.documentoAtribuicao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      atribuicao.comiteAprovador.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDominio = dominioFilter === "all" || atribuicao.dominioId === dominioFilter
    const matchesPapel = papelFilter === "all" || atribuicao.papelId === papelFilter
    return matchesSearch && matchesDominio && matchesPapel
  }) || []

  // Calcular estatísticas
  const totalAtribuicoes = atribuicoesData?.data?.length || 0
  const totalComDocumento = atribuicoesData?.data?.filter(a => a.documentoAtribuicao).length || 0
  const totalComComite = atribuicoesData?.data?.filter(a => a.comiteAprovador).length || 0
  const totalComOnboarding = atribuicoesData?.data?.filter(a => a.onboarding).length || 0

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta atribuição?")) {
      await deleteAtribuicao.mutateAsync(id)
    }
  }

  const handleEdit = (atribuicao: AtribuicaoResponse) => {
    setEditingAtribuicao(atribuicao)
    setFormOpen(true)
  }

  const handleCloseForm = () => {
    setFormOpen(false)
    setEditingAtribuicao(undefined)
  }

  const getDominioNome = (dominioId: string) => {
    return dominiosData?.data?.find(d => d.id === dominioId)?.nome || dominioId
  }

  const getPapelNome = (papelId: string) => {
    return papeisData?.data?.find(p => p.id === papelId)?.nome || papelId
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight">Atribuições Papel↔Domínio</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie as atribuições entre papéis e domínios
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}><CardHeader><Skeleton className="h-4 w-20" /></CardHeader>
            <CardContent><Skeleton className="h-8 w-16 mb-2" /><Skeleton className="h-3 w-24" /></CardContent></Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight">Atribuições Papel↔Domínio</h1>
          <p className="text-muted-foreground mt-2">Gerencie as atribuições entre papéis e domínios</p>
        </div>
        <Card><CardContent className="p-6"><p className="text-center text-muted-foreground">Erro ao carregar dados. Tente novamente.</p></CardContent></Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight">Atribuições Papel↔Domínio</h1>
        <p className="text-muted-foreground mt-2">Gerencie as atribuições entre papéis e domínios</p>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Workflow className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAtribuicoes}</div>
            <p className="text-xs text-muted-foreground">Atribuições cadastradas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Com Documento</CardTitle>
            <Workflow className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalComDocumento}</div>
            <p className="text-xs text-muted-foreground">Com documento de atribuição</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Com Comitê</CardTitle>
            <Workflow className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalComComite}</div>
            <p className="text-xs text-muted-foreground">Com comitê aprovador</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Com Onboarding</CardTitle>
            <Workflow className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalComOnboarding}</div>
            <p className="text-xs text-muted-foreground">Com onboarding habilitado</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e busca */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle>Atribuições Papel↔Domínio</CardTitle>
              <CardDescription>Lista de atribuições entre papéis e domínios cadastrados</CardDescription>
            </div>
            <Button onClick={() => setFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Atribuição
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar atribuições..." className="pl-8" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <Select value={dominioFilter} onValueChange={setDominioFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filtrar por domínio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os domínios</SelectItem>
                  {dominiosData?.data?.map((dominio) => (
                    <SelectItem key={dominio.id} value={dominio.id}>{dominio.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={papelFilter} onValueChange={setPapelFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filtrar por papel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os papéis</SelectItem>
                  {papeisData?.data?.map((papel) => (
                    <SelectItem key={papel.id} value={papel.id}>{papel.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tabela */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Domínio</TableHead>
                  <TableHead>Papel</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Comitê</TableHead>
                  <TableHead>Onboarding</TableHead>
                  <TableHead className="w-[100px] text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAtribuicoes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">Nenhuma atribuição encontrada</TableCell>
                  </TableRow>
                ) : (
                  filteredAtribuicoes.map((atribuicao) => (
                    <TableRow key={atribuicao.id}>
                      <TableCell className="font-medium">
                        <Badge variant="outline">{getDominioNome(atribuicao.dominioId)}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{getPapelNome(atribuicao.papelId)}</Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{atribuicao.documentoAtribuicao}</TableCell>
                      <TableCell className="max-w-xs truncate">{atribuicao.comiteAprovador}</TableCell>
                      <TableCell>
                        <Badge variant={atribuicao.onboarding ? "default" : "outline"}>
                          {atribuicao.onboarding ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(atribuicao)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(atribuicao.id)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog do formulário */}
      <AtribuicaoForm open={formOpen} onOpenChange={handleCloseForm} atribuicao={editingAtribuicao} />
    </div>
  )
}
