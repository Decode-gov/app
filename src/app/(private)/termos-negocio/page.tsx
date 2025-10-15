"use client"

import { useState } from "react"
import { Plus, Search, MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useDefinicoes, useDeleteDefinicao } from "@/hooks/api/use-definicoes"
import { TermoForm } from "@/components/termos/termo-form"
import { DefinicaoResponse } from "@/types/api"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function TermosNegocioPage() {
  const [formOpen, setFormOpen] = useState(false)
  const [editingTermo, setEditingTermo] = useState<DefinicaoResponse | undefined>()
  const [search, setSearch] = useState("")
  const [ativoFilter, setAtivoFilter] = useState<string>("all")

  const { data: termosData, isLoading } = useDefinicoes()
  const deleteMutation = useDeleteDefinicao()

  const termos = termosData?.data || []

  const filteredTermos = termos.filter((termo) => {
    const matchesSearch = 
      search === "" ||
      termo.termo.toLowerCase().includes(search.toLowerCase()) ||
      termo.definicao?.toLowerCase().includes(search.toLowerCase())
    
    const matchesAtivo = ativoFilter === "all" || 
      (ativoFilter === "ativo" && termo.ativo) ||
      (ativoFilter === "inativo" && !termo.ativo)
    
    return matchesSearch && matchesAtivo
  })

  const handleEdit = (termo: DefinicaoResponse) => {
    setEditingTermo(termo)
    setFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este termo?")) {
      try {
        await deleteMutation.mutateAsync(id)
      } catch (error) {
        console.error('Erro ao excluir termo:', error)
      }
    }
  }

  const handleNewTermo = () => {
    setEditingTermo(undefined)
    setFormOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Termos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{termos.length}</div>
            <p className="text-xs text-muted-foreground">
              {filteredTermos.length} {filteredTermos.length === 1 ? 'resultado' : 'resultados'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Termos Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{termos.filter(t => t.ativo).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Termos Inativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{termos.filter(t => !t.ativo).length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Termos de Negócio</CardTitle>
              <CardDescription>Gerencie o glossário de termos</CardDescription>
            </div>
            <Button onClick={handleNewTermo}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Termo
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar termos..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={ativoFilter} onValueChange={setAtivoFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="ativo">Ativos</SelectItem>
                <SelectItem value="inativo">Inativos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-sm text-muted-foreground">Carregando...</p>
            </div>
          ) : filteredTermos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-sm text-muted-foreground">
                {search || ativoFilter !== "all"
                  ? "Nenhum termo encontrado."
                  : "Nenhum termo cadastrado."}
              </p>
              {!search && ativoFilter === "all" && (
                <Button onClick={handleNewTermo} variant="outline" className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Cadastrar primeiro termo
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Termo</TableHead>
                    <TableHead>Definição</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead className="w-[70px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTermos.map((termo) => (
                    <TableRow key={termo.id}>
                      <TableCell className="font-medium">{termo.termo}</TableCell>
                      <TableCell>
                        <div className="max-w-[400px] truncate text-sm text-muted-foreground">
                          {termo.definicao}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={termo.ativo ? "default" : "secondary"}>
                          {termo.ativo ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(termo.createdAt), "dd/MM/yyyy", { locale: ptBR })}
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
                            <DropdownMenuItem onClick={() => handleEdit(termo)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(termo.id)}
                              className="text-destructive"
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
          )}
        </CardContent>
      </Card>

      <TermoForm
        open={formOpen}
        onOpenChange={setFormOpen}
        termo={editingTermo}
      />
    </div>
  )
}
