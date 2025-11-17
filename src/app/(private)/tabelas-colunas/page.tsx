"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Database } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useColunas, useDeleteColuna } from "@/hooks/api/use-colunas"
import { useTabelas } from "@/hooks/api/use-tabelas"
import { useSistemas } from "@/hooks/api/use-sistemas"
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

  const { data: tabelasData } = useTabelas({})
  const { data: sistemasData } = useSistemas({})

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
  const tabelas = tabelasData?.data || []
  const sistemas = sistemasData?.data || []

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
              <CardTitle className="text-sm font-medium">Tabelas</CardTitle>
              <div className="p-2 rounded-lg bg-purple-100 group-hover:bg-purple-200 transition-colors duration-300">
                <Database className="h-4 w-4 text-purple-600 transition-colors duration-300" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{tabelas.length || 0}</div>
              <p className="text-xs text-muted-foreground">tabelas mapeadas</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Colunas</CardTitle>
              <div className="p-2 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors duration-300">
                <Database className="h-4 w-4 text-blue-600 transition-colors duration-300" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{colunasData?.data.length || 0}</div>
              <p className="text-xs text-muted-foreground">colunas mapeadas</p>
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
            <div className="flex items-center gap-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar colunas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <div>
                <Select value={sistemaFilter || "todos"} onValueChange={(value) => setSistemaFilter(value === "todos" ? "" : value)}>
                  <SelectTrigger className="w-[250px]">
                    <SelectValue placeholder="Filtrar por sistema" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os sistemas</SelectItem>
                    {sistemas.map((sistema) => (
                      <SelectItem key={sistema.id} value={sistema.id}>
                        {sistema.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Termo</TableHead>
                    <TableHead>Questão Gerencial</TableHead>
                    <TableHead>Coluna</TableHead>
                    <TableHead>Tabela</TableHead>
                    <TableHead className="w-[70px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingColunas ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[300px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-[40px]" /></TableCell>
                      </TableRow>
                    ))
                  ) : errorColunas ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        Erro ao carregar colunas. Tente novamente.
                      </TableCell>
                    </TableRow>
                  ) : (colunas.length === 0) ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        Nenhuma coluna encontrada
                      </TableCell>
                    </TableRow>
                  ) : (
                    colunas.map((coluna: ColunaResponse) => (
                      <TableRow key={coluna.id}>
                        <TableCell>{coluna.termo?.termo}</TableCell>
                        <TableCell className="w-[300px] line-clamp-1" title={coluna.necessidadeInformacao?.questaoGerencial}>{coluna.necessidadeInformacao?.questaoGerencial}</TableCell>
                        <TableCell>{coluna.nome}</TableCell>
                        <TableCell>{coluna.tabela?.nome}</TableCell>
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
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <ColunaForm open={isFormOpen} onOpenChange={setIsFormOpen} coluna={selectedColuna} />
    </>
  )
}
