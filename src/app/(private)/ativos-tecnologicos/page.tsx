"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Server, Database, Link as LinkIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSistemas, useDeleteSistema } from "@/hooks/api/use-sistemas"
import { useBancos, useDeleteBanco } from "@/hooks/api/use-bancos"
import { SistemaResponse, BancoResponse } from "@/types/api"
import { SistemaForm } from "@/components/ativos/sistema-form"
import { BancoForm } from "@/components/ativos/banco-form"

export default function AtivosTecnologicosPage() {
  const [searchTermSistema, setSearchTermSistema] = useState("")
  const [searchTermBanco, setSearchTermBanco] = useState("")
  const [page] = useState(1)
  const [limit] = useState(10)
  const [isSistemaFormOpen, setIsSistemaFormOpen] = useState(false)
  const [isBancoFormOpen, setIsBancoFormOpen] = useState(false)
  const [selectedSistema, setSelectedSistema] = useState<SistemaResponse | undefined>()
  const [selectedBanco, setSelectedBanco] = useState<BancoResponse | undefined>()

  const { data: sistemasData, isLoading: isLoadingSistemas, error: errorSistemas } = useSistemas({
    page,
    limit,
    search: searchTermSistema || undefined,
  })
  
  const { data: bancosData, isLoading: isLoadingBancos, error: errorBancos } = useBancos({
    page,
    limit,
    search: searchTermBanco || undefined,
  })

  const deleteSistema = useDeleteSistema()
  const deleteBanco = useDeleteBanco()

  const handleEditSistema = (sistema: SistemaResponse) => {
    setSelectedSistema(sistema)
    setIsSistemaFormOpen(true)
  }

  const handleNewSistema = () => {
    setSelectedSistema(undefined)
    setIsSistemaFormOpen(true)
  }

  const handleDeleteSistema = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este sistema?")) {
      await deleteSistema.mutateAsync(id)
    }
  }

  const handleEditBanco = (banco: BancoResponse) => {
    setSelectedBanco(banco)
    setIsBancoFormOpen(true)
  }

  const handleNewBanco = () => {
    setSelectedBanco(undefined)
    setIsBancoFormOpen(true)
  }

  const handleDeleteBanco = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este banco de dados?")) {
      await deleteBanco.mutateAsync(id)
    }
  }

  const sistemas = sistemasData?.data || []
  const bancos = bancosData?.data || []

  const sistemasComBanco = sistemas.filter(s => s.bancoDados)
  const sistemasComRepo = sistemas.filter(s => s.repositorio)

  return (
    <>
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Ativos Tecnológicos
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie sistemas e bancos de dados do sistema DECODE-GOV
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sistemas</CardTitle>
              <div className="p-2 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors duration-300">
                <Server className="h-4 w-4 text-blue-600 transition-colors duration-300" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{sistemasData?.total || 0}</div>
              <p className="text-xs text-muted-foreground">sistemas cadastrados</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bancos de Dados</CardTitle>
              <div className="p-2 rounded-lg bg-orange-100 group-hover:bg-orange-200 transition-colors duration-300">
                <Database className="h-4 w-4 text-orange-600 transition-colors duration-300" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{bancosData?.total || 0}</div>
              <p className="text-xs text-muted-foreground">bancos cadastrados</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Com Banco</CardTitle>
              <div className="p-2 rounded-lg bg-green-100 group-hover:bg-green-200 transition-colors duration-300">
                <Database className="h-4 w-4 text-green-600 transition-colors duration-300" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{sistemasComBanco.length}</div>
              <p className="text-xs text-muted-foreground">sistemas com banco definido</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Com Repositório</CardTitle>
              <div className="p-2 rounded-lg bg-purple-100 group-hover:bg-purple-200 transition-colors duration-300">
                <LinkIcon className="h-4 w-4 text-purple-600 transition-colors duration-300" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{sistemasComRepo.length}</div>
              <p className="text-xs text-muted-foreground">sistemas com repositório</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="sistemas" className="w-full">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2 bg-foreground/10">
            <TabsTrigger value="sistemas">Sistemas</TabsTrigger>
            <TabsTrigger value="bancos">Bancos de Dados</TabsTrigger>
          </TabsList>

          <TabsContent value="sistemas" className="space-y-4">
            <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Sistemas</CardTitle>
                    <CardDescription>
                      Lista de todos os sistemas cadastrados
                    </CardDescription>
                  </div>
                  <Button className="gap-2" onClick={handleNewSistema}>
                    <Plus className="h-4 w-4" />
                    Novo Sistema
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar sistemas..."
                    value={searchTermSistema}
                    onChange={(e) => setSearchTermSistema(e.target.value)}
                    className="pl-8"
                  />
                </div>

                {isLoadingSistemas ? (
                  <Skeleton className="h-[400px] w-full" />
                ) : errorSistemas ? (
                  <p className="text-center text-muted-foreground py-8">
                    Erro ao carregar sistemas. Tente novamente.
                  </p>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Sistema</TableHead>
                          <TableHead>Banco de Dados</TableHead>
                          <TableHead>Tecnologia</TableHead>
                          <TableHead>Repositório</TableHead>
                          <TableHead>Responsável</TableHead>
                          <TableHead className="w-[70px]">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sistemas.map((sistema: SistemaResponse) => (
                          <TableRow key={sistema.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <Server className="h-4 w-4 text-blue-500" />
                                {sistema.sistema}
                              </div>
                            </TableCell>
                            <TableCell>
                              {sistema.bancoDados ? (
                                <Badge variant="secondary">{sistema.bancoDados}</Badge>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {sistema.tecnologia ? (
                                <span className="text-sm">{sistema.tecnologia}</span>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {sistema.repositorio ? (
                                <a 
                                  href={sistema.repositorio} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-blue-600 hover:underline"
                                >
                                  <LinkIcon className="h-3 w-3" />
                                  <span className="max-w-[150px] truncate">Link</span>
                                </a>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {sistema.responsavelTecnico || <span className="text-muted-foreground">-</span>}
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleEditSistema(sistema)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Editar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="text-destructive"
                                    onClick={() => handleDeleteSistema(sistema.id)}
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
          </TabsContent>

          <TabsContent value="bancos" className="space-y-4">
            <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Bancos de Dados</CardTitle>
                    <CardDescription>
                      Lista de todos os bancos de dados cadastrados
                    </CardDescription>
                  </div>
                  <Button className="gap-2" onClick={handleNewBanco}>
                    <Plus className="h-4 w-4" />
                    Novo Banco
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar bancos..."
                    value={searchTermBanco}
                    onChange={(e) => setSearchTermBanco(e.target.value)}
                    className="pl-8"
                  />
                </div>

                {isLoadingBancos ? (
                  <Skeleton className="h-[400px] w-full" />
                ) : errorBancos ? (
                  <p className="text-center text-muted-foreground py-8">
                    Erro ao carregar bancos. Tente novamente.
                  </p>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>Descrição</TableHead>
                          <TableHead>Sistema</TableHead>
                          <TableHead>Criado em</TableHead>
                          <TableHead className="w-[70px]">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bancos.map((banco: BancoResponse) => {
                          const sistema = sistemas.find(s => s.id === banco.sistemaId)
                          
                          return (
                            <TableRow key={banco.id}>
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                  <Database className="h-4 w-4 text-orange-500" />
                                  {banco.nome}
                                </div>
                              </TableCell>
                              <TableCell>
                                {banco.descricao ? (
                                  <div className="max-w-[300px] truncate" title={banco.descricao}>
                                    {banco.descricao}
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground">-</span>
                                )}
                              </TableCell>
                              <TableCell>
                                {sistema ? (
                                  <Badge variant="outline">{sistema.sistema}</Badge>
                                ) : (
                                  <span className="text-muted-foreground">-</span>
                                )}
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {new Date(banco.createdAt).toLocaleDateString('pt-BR')}
                              </TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleEditBanco(banco)}>
                                      <Edit className="mr-2 h-4 w-4" />
                                      Editar
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      className="text-destructive"
                                      onClick={() => handleDeleteBanco(banco.id)}
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
          </TabsContent>
        </Tabs>
      </div>

      <SistemaForm open={isSistemaFormOpen} onOpenChange={setIsSistemaFormOpen} sistema={selectedSistema} />
      <BancoForm open={isBancoFormOpen} onOpenChange={setIsBancoFormOpen} banco={selectedBanco} />
    </>
  )
}
