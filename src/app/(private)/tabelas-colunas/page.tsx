"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Table2, Database } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useColunas, useDeleteColuna } from "@/hooks/api/use-colunas"
import { useDefinicoes } from "@/hooks/api/use-definicoes"
import { useSistemas } from "@/hooks/api/use-sistemas"
import { useBancos } from "@/hooks/api/use-bancos"
import { useNecessidadesInformacao } from "@/hooks/api/use-necessidades-informacao"
import { ColunaResponse } from "@/types/api"
import { ColunaForm } from "@/components/colunas/coluna-form"

export default function TabelasColunasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sistemaFilter, setSistemaFilter] = useState<string>("")
  const [page] = useState(1)
  const [limit] = useState(10)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedColuna, setSelectedColuna] = useState<ColunaResponse | undefined>()

  const { data: colunasData, isLoading: isLoadingColunas, error: errorColunas } = useColunas({
    page,
    limit,
    search: searchTerm || undefined,
  })
  
  const { data: definicoesData } = useDefinicoes({ page: 1, limit: 1000 })
  const { data: sistemasData } = useSistemas({ page: 1, limit: 1000 })
  const { data: bancosData } = useBancos({ page: 1, limit: 1000 })
  const { data: necessidadesData } = useNecessidadesInformacao({ page: 1, limit: 1000 })

  const deleteColuna = useDeleteColuna()

  const handleEdit = (coluna: ColunaResponse) => {
    setSelectedColuna(coluna)
    setIsFormOpen(true)
  }

  const handleNew = () => {
    setSelectedColuna(undefined)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta coluna?")) {
      await deleteColuna.mutateAsync(id)
    }
  }

  const colunas = colunasData?.data || []
  const definicoes = definicoesData?.data || []
  const sistemas = sistemasData?.data || []
  const bancos = bancosData?.data || []
  const necessidades = necessidadesData?.data || []

  const filteredColunas = sistemaFilter
    ? colunas.filter(c => c.sistemaId === sistemaFilter)
    : colunas

  const tabelasAgrupadas = filteredColunas.reduce<Record<string, ColunaResponse[]>>((acc, coluna) => {
    const key = `${coluna.sistemaId}-${coluna.tabela}`
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(coluna)
    return acc
  }, {})

  const tabelasUnicas = Object.keys(tabelasAgrupadas).length
  const sistemasUnicos = [...new Set(colunas.map(c => c.sistemaId))].length
  const colunasComNecessidade = colunas.filter(c => c.questaoGerencialId).length

  return (
    <>
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Tabelas e Colunas
          </h1>
          <p className="text-muted-foreground mt-2">
            Mapeamento de tabelas e colunas dos sistemas do DECODE-GOV
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Colunas</CardTitle>
              <div className="p-2 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors duration-300">
                <Database className="h-4 w-4 text-blue-600 transition-colors duration-300" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{colunasData?.total || 0}</div>
              <p className="text-xs text-muted-foreground">colunas mapeadas</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tabelas</CardTitle>
              <div className="p-2 rounded-lg bg-orange-100 group-hover:bg-orange-200 transition-colors duration-300">
                <Table2 className="h-4 w-4 text-orange-600 transition-colors duration-300" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{tabelasUnicas}</div>
              <p className="text-xs text-muted-foreground">tabelas únicas</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sistemas</CardTitle>
              <div className="p-2 rounded-lg bg-green-100 group-hover:bg-green-200 transition-colors duration-300">
                <Database className="h-4 w-4 text-green-600 transition-colors duration-300" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{sistemasUnicos}</div>
              <p className="text-xs text-muted-foreground">sistemas com colunas</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Com Necessidade</CardTitle>
              <div className="p-2 rounded-lg bg-purple-100 group-hover:bg-purple-200 transition-colors duration-300">
                <Database className="h-4 w-4 text-purple-600 transition-colors duration-300" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{colunasComNecessidade}</div>
              <p className="text-xs text-muted-foreground">com necessidade de informação</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Colunas Mapeadas</CardTitle>
                <CardDescription>
                  Lista de todas as colunas cadastradas
                </CardDescription>
              </div>
              <Button className="gap-2" onClick={handleNew}>
                <Plus className="h-4 w-4" />
                Nova Coluna
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar colunas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={sistemaFilter || "todos"} onValueChange={(value) => setSistemaFilter(value === "todos" ? "" : value)}>
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Filtrar por sistema" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os sistemas</SelectItem>
                  {sistemas.map((sistema) => (
                    <SelectItem key={sistema.id} value={sistema.id}>
                      {sistema.sistema}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isLoadingColunas ? (
              <Skeleton className="h-[400px] w-full" />
            ) : errorColunas ? (
              <p className="text-center text-muted-foreground py-8">
                Erro ao carregar colunas. Tente novamente.
              </p>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Termo</TableHead>
                      <TableHead>Sistema</TableHead>
                      <TableHead>Banco</TableHead>
                      <TableHead>Tabela</TableHead>
                      <TableHead>Coluna</TableHead>
                      <TableHead>Necessidade</TableHead>
                      <TableHead className="w-[70px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredColunas.map((coluna: ColunaResponse) => {
                      const termo = definicoes.find(d => d.id === coluna.termoId)
                      const sistema = sistemas.find(s => s.id === coluna.sistemaId)
                      const banco = bancos.find(b => b.id === coluna.bancoId)
                      const necessidade = necessidades.find(n => n.id === coluna.questaoGerencialId)

                      return (
                        <TableRow key={coluna.id}>
                          <TableCell className="font-medium">
                            {termo ? (
                              <Badge variant="secondary">{termo.termo}</Badge>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {sistema ? sistema.sistema : <span className="text-muted-foreground">-</span>}
                          </TableCell>
                          <TableCell>
                            {banco ? (
                              <Badge variant="outline">{banco.nome}</Badge>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <span className="font-mono text-sm">{coluna.tabela}</span>
                          </TableCell>
                          <TableCell>
                            <span className="font-mono text-sm font-medium">{coluna.coluna}</span>
                          </TableCell>
                          <TableCell>
                            {necessidade ? (
                              <div className="max-w-[200px] truncate" title={necessidade.questaoGerencial}>
                                {necessidade.questaoGerencial}
                              </div>
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
                                <DropdownMenuItem onClick={() => handleEdit(coluna)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-destructive"
                                  onClick={() => handleDelete(coluna.id)}
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

      <ColunaForm open={isFormOpen} onOpenChange={setIsFormOpen} coluna={selectedColuna} />
    </>
  )
}
