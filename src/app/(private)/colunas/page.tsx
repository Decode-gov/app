"use client"

import { useState } from "react"
import { Plus, Search, MoreHorizontal, Edit, Trash2 } from "lucide-react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useColunas, useDeleteColuna } from "@/hooks/api/use-colunas"
import { useTabelas } from "@/hooks/api/use-tabelas"
import { useTiposDados } from "@/hooks/api/use-tipos-dados"
import { ColunaForm } from "@/components/colunas/coluna-form"
import { ColunaResponse } from "@/types/api"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function ColunasPage() {
  const [formOpen, setFormOpen] = useState(false)
  const [editingColuna, setEditingColuna] = useState<ColunaResponse | undefined>()
  const [search, setSearch] = useState("")
  const [tabelaFilter, setTabelaFilter] = useState<string>("all")
  const [tipoDadosFilter, setTipoDadosFilter] = useState<string>("all")

  const { data: colunasData, isLoading } = useColunas()
  const { data: tabelasData } = useTabelas()
  const { data: tiposDadosData } = useTiposDados()
  const deleteMutation = useDeleteColuna()

  const colunas = colunasData?.data || []
  const tabelas = tabelasData?.data || []
  const tiposDados = tiposDadosData?.data || []

  const filteredColunas = colunas.filter((coluna) => {
    const matchesSearch = 
      search === "" ||
      coluna.nome.toLowerCase().includes(search.toLowerCase()) ||
      coluna.descricao?.toLowerCase().includes(search.toLowerCase())
    
    const matchesTabela = 
      tabelaFilter === "all" || 
      coluna.tabelaId === tabelaFilter

    const matchesTipoDados = 
      tipoDadosFilter === "all" || 
      coluna.tipoDadosId === tipoDadosFilter

    return matchesSearch && matchesTabela && matchesTipoDados
  })

  const handleEdit = (coluna: ColunaResponse) => {
    setEditingColuna(coluna)
    setFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta coluna?")) {
      try {
        await deleteMutation.mutateAsync(id)
      } catch (error) {
        console.error('Erro ao excluir coluna:', error)
      }
    }
  }

  const handleNewColuna = () => {
    setEditingColuna(undefined)
    setFormOpen(true)
  }

  const getTabelaNome = (tabelaId: string) => {
    const tabela = tabelas.find(t => t.id === tabelaId)
    return tabela?.nome || "N/A"
  }

  const getTipoDadosNome = (tipoDadosId: string) => {
    const tipoDados = tiposDados.find(t => t.id === tipoDadosId)
    return tipoDados?.nome || "N/A"
  }

  const getTipoDadosCategoria = (tipoDadosId: string) => {
    const tipoDados = tiposDados.find(t => t.id === tipoDadosId)
    return tipoDados?.categoria
  }

  return (
    <div className="space-y-6">
      {/* Stats Card */}
      <div className="grid gap-4 md:grid-cols-1">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Colunas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{colunas.length}</div>
            <p className="text-xs text-muted-foreground">
              {filteredColunas.length} {filteredColunas.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Colunas</CardTitle>
              <CardDescription>
                Gerencie as colunas das tabelas
              </CardDescription>
            </div>
            <Button onClick={handleNewColuna}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Coluna
            </Button>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar colunas..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={tabelaFilter} onValueChange={setTabelaFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filtrar por tabela" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as tabelas</SelectItem>
                {tabelas.map((tabela) => (
                  <SelectItem key={tabela.id} value={tabela.id}>
                    {tabela.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={tipoDadosFilter} onValueChange={setTipoDadosFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                {tiposDados.map((tipo) => (
                  <SelectItem key={tipo.id} value={tipo.id}>
                    {tipo.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-sm text-muted-foreground">Carregando...</p>
            </div>
          ) : filteredColunas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-sm text-muted-foreground">
                {search || tabelaFilter !== "all" || tipoDadosFilter !== "all"
                  ? "Nenhuma coluna encontrada com os filtros aplicados."
                  : "Nenhuma coluna cadastrada."}
              </p>
              {!search && tabelaFilter === "all" && tipoDadosFilter === "all" && (
                <Button onClick={handleNewColuna} variant="outline" className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Cadastrar primeira coluna
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Tabela</TableHead>
                    <TableHead>Tipo de Dados</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead className="w-[70px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredColunas.map((coluna) => (
                    <TableRow key={coluna.id}>
                      <TableCell className="font-medium">
                        {coluna.nome}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{getTabelaNome(coluna.tabelaId)}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{getTipoDadosNome(coluna.tipoDadosId)}</span>
                          {getTipoDadosCategoria(coluna.tipoDadosId) && (
                            <Badge variant="outline" className="text-xs">
                              {getTipoDadosCategoria(coluna.tipoDadosId)}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[300px] truncate text-sm text-muted-foreground">
                          {coluna.descricao || ""}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(coluna.createdAt), "dd/MM/yyyy", { locale: ptBR })}
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
                            <DropdownMenuItem onClick={() => handleEdit(coluna)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(coluna.id)}
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

      <ColunaForm
        open={formOpen}
        onOpenChange={setFormOpen}
        coluna={editingColuna}
      />
    </div>
  )
}
