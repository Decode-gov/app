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
import { useTabelas, useDeleteTabela } from "@/hooks/api/use-tabelas"
import { useBancos } from "@/hooks/api/use-bancos"
import { useSistemas } from "@/hooks/api/use-sistemas"
import { TabelaForm } from "@/components/tabelas/tabela-form"
import { TabelaResponse } from "@/types/api"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function TabelasPage() {
  const [formOpen, setFormOpen] = useState(false)
  const [editingTabela, setEditingTabela] = useState<TabelaResponse | undefined>()
  const [search, setSearch] = useState("")
  const [sistemaFilter, setSistemaFilter] = useState<string>("all")
  const [bancoFilter, setBancoFilter] = useState<string>("all")

  const { data: tabelasData, isLoading } = useTabelas()
  const { data: sistemasData } = useSistemas()
  const { data: bancosData } = useBancos()
  const deleteMutation = useDeleteTabela()

  const tabelas = tabelasData?.data || []
  const sistemas = sistemasData?.data || []
  const bancos = bancosData?.data || []

  const filteredTabelas = tabelas.filter((tabela) => {
    const matchesSearch = 
      search === "" ||
      tabela.nome.toLowerCase().includes(search.toLowerCase()) ||
      tabela.descricao?.toLowerCase().includes(search.toLowerCase())
    
    const matchesSistema = 
      sistemaFilter === "all" || 
      tabela.sistemaId === sistemaFilter

    const matchesBanco = 
      bancoFilter === "all" || 
      tabela.bancoId === bancoFilter

    return matchesSearch && matchesSistema && matchesBanco
  })

  const handleEdit = (tabela: TabelaResponse) => {
    setEditingTabela(tabela)
    setFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta tabela?")) {
      try {
        await deleteMutation.mutateAsync(id)
      } catch (error) {
        console.error('Erro ao excluir tabela:', error)
      }
    }
  }

  const handleNewTabela = () => {
    setEditingTabela(undefined)
    setFormOpen(true)
  }

  const getBancoNome = (bancoId: string) => {
    const banco = bancos.find(b => b.id === bancoId)
    return banco?.nome || "N/A"
  }

  const getSistemaNome = (sistemaId: string) => {
    const sistema = sistemas.find(s => s.id === sistemaId)
    return sistema?.sistema || "N/A"
  }

  const getSistemaTecnologia = (sistemaId: string) => {
    const sistema = sistemas.find(s => s.id === sistemaId)
    return sistema?.tecnologia
  }

  return (
    <div className="space-y-6">
      {/* Stats Card */}
      <div className="grid gap-4 md:grid-cols-1">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Tabelas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tabelas.length}</div>
            <p className="text-xs text-muted-foreground">
              {filteredTabelas.length} {filteredTabelas.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Tabelas</CardTitle>
              <CardDescription>
                Gerencie as tabelas do sistema
              </CardDescription>
            </div>
            <Button onClick={handleNewTabela}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Tabela
            </Button>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar tabelas..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={bancoFilter} onValueChange={setBancoFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filtrar por banco" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os bancos</SelectItem>
                {bancos.map((banco) => (
                  <SelectItem key={banco.id} value={banco.id}>
                    {banco.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sistemaFilter} onValueChange={setSistemaFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filtrar por sistema" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os sistemas</SelectItem>
                {sistemas.map((sistema) => (
                  <SelectItem key={sistema.id} value={sistema.id}>
                    {sistema.sistema}
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
          ) : filteredTabelas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-sm text-muted-foreground">
                {search || sistemaFilter !== "all" || bancoFilter !== "all"
                  ? "Nenhuma tabela encontrada com os filtros aplicados."
                  : "Nenhuma tabela cadastrada."}
              </p>
              {!search && sistemaFilter === "all" && bancoFilter === "all" && (
                <Button onClick={handleNewTabela} variant="outline" className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Cadastrar primeira tabela
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Banco de Dados</TableHead>
                    <TableHead>Sistema</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead className="w-[70px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTabelas.map((tabela) => (
                    <TableRow key={tabela.id}>
                      <TableCell className="font-medium">
                        {tabela.nome}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm">{getBancoNome(tabela.bancoId)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{getSistemaNome(tabela.sistemaId)}</span>
                          {getSistemaTecnologia(tabela.sistemaId) && (
                            <Badge variant="outline" className="text-xs">
                              {getSistemaTecnologia(tabela.sistemaId)}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[300px] truncate text-sm text-muted-foreground">
                          {tabela.descricao || "—"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(tabela.createdAt), "dd/MM/yyyy", { locale: ptBR })}
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
                            <DropdownMenuItem onClick={() => handleEdit(tabela)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(tabela.id)}
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

      <TabelaForm
        open={formOpen}
        onOpenChange={setFormOpen}
        tabela={editingTabela}
      />
    </div>
  )
}
