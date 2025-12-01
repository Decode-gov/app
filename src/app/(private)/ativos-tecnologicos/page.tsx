"use client"

import { useState } from "react"
import { Plus, Server, Database, GitBranch, HardDrive, FolderGit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSistemas, useDeleteSistema } from "@/hooks/api/use-sistemas"
import { useBancos, useDeleteBanco } from "@/hooks/api/use-bancos"
import { useRepositoriosDocumento, useDeleteRepositorioDocumento } from "@/hooks/api/use-repositorios-documento"
import { SistemaResponse, BancoResponse, RepositorioDocumentoResponse } from "@/types/api"
import { SistemaForm } from "@/components/sistemas/sistema-form"
import { BancoForm } from "@/components/bancos/banco-form"
import { RepositorioForm } from "@/components/repositorios-documento/repositorio-form"
import { SistemaTable } from "@/components/sistemas/sistema-table"
import { BancoTable } from "@/components/bancos/banco-table"
import { RepositorioTable } from "@/components/repositorios-documento/repositorio-table"

export default function AtivosTecnologicosPage() {
  const [isSistemaFormOpen, setIsSistemaFormOpen] = useState(false)
  const [isBancoFormOpen, setIsBancoFormOpen] = useState(false)
  const [isRepositorioFormOpen, setIsRepositorioFormOpen] = useState(false)
  const [selectedSistema, setSelectedSistema] = useState<SistemaResponse | undefined>()
  const [selectedBanco, setSelectedBanco] = useState<BancoResponse | undefined>()
  const [selectedRepositorio, setSelectedRepositorio] = useState<RepositorioDocumentoResponse | undefined>()

  const { data: sistemasData, isLoading: isLoadingSistemas, error: errorSistemas } = useSistemas({ })
  const { data: bancosData, isLoading: isLoadingBancos, error: errorBancos } = useBancos({ })
  const { data: repositoriosData, isLoading: isLoadingRepositorios, error: errorRepositorios } = useRepositoriosDocumento({ })

  const deleteSistema = useDeleteSistema()
  const deleteBanco = useDeleteBanco()
  const deleteRepositorio = useDeleteRepositorioDocumento()

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

  const handleEditRepositorio = (repositorio: RepositorioDocumentoResponse) => {
    setSelectedRepositorio(repositorio)
    setIsRepositorioFormOpen(true)
  }

  const handleNewRepositorio = () => {
    setSelectedRepositorio(undefined)
    setIsRepositorioFormOpen(true)
  }

  const handleDeleteRepositorio = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este repositório de documentos?")) {
      await deleteRepositorio.mutateAsync(id)
    }
  }

  const sistemas = sistemasData?.data || []
  const bancos = bancosData?.data || []
  const repositorios = repositoriosData?.data || []

  const totalSistemas = sistemasData?.total || 0
  const totalBancos = bancosData?.total || 0
  const totalRepositorios = repositoriosData?.total || 0
  const sistemasComBanco = sistemas.filter(s => s.bancos && s.bancos.length > 0).length

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
              <div className="text-2xl font-bold text-blue-600">{totalSistemas}</div>
              <p className="text-xs text-muted-foreground">sistemas cadastrados</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bancos de Dados</CardTitle>
              <div className="p-2 rounded-lg bg-green-100 group-hover:bg-green-200 transition-colors duration-300">
                <Database className="h-4 w-4 text-green-600 transition-colors duration-300" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{totalBancos}</div>
              <p className="text-xs text-muted-foreground">bancos cadastrados</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Repositórios</CardTitle>
              <div className="p-2 rounded-lg bg-cyan-100 group-hover:bg-cyan-200 transition-colors duration-300">
                <FolderGit2 className="h-4 w-4 text-cyan-600 transition-colors duration-300" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cyan-600">{totalRepositorios}</div>
              <p className="text-xs text-muted-foreground">repositórios cadastrados</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sistemas com BD</CardTitle>
              <div className="p-2 rounded-lg bg-purple-100 group-hover:bg-purple-200 transition-colors duration-300">
                <HardDrive className="h-4 w-4 text-purple-600 transition-colors duration-300" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{sistemasComBanco}</div>
              <p className="text-xs text-muted-foreground">com banco de dados</p>
            </CardContent>
          </Card>

        </div>

        <Tabs defaultValue="sistemas" className="w-full">
          <TabsList className="grid w-full md:w-[600px] grid-cols-3 bg-foreground/10">
            <TabsTrigger value="sistemas">Sistemas</TabsTrigger>
            <TabsTrigger value="bancos">Bancos de Dados</TabsTrigger>
            <TabsTrigger value="repositorios">Repositórios</TabsTrigger>
          </TabsList>

          <TabsContent value="sistemas" className="space-y-4">
            <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Sistemas Cadastrados</CardTitle>
                    <CardDescription>
                      Lista de todos os sistemas cadastrados no DECODE-GOV
                    </CardDescription>
                  </div>
                  <Button className="gap-2" onClick={handleNewSistema}>
                    <Plus className="h-4 w-4" />
                    Novo Sistema
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingSistemas ? (
                  <div className="text-center py-8">Carregando...</div>
                ) : errorSistemas ? (
                  <p className="text-center text-muted-foreground py-8">
                    Erro ao carregar sistemas. Tente novamente.
                  </p>
                ) : (
                  <SistemaTable
                    data={sistemas}
                    onEdit={handleEditSistema}
                    onDelete={handleDeleteSistema}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bancos" className="space-y-4">
            <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Bancos de Dados Cadastrados</CardTitle>
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
              <CardContent>
                {isLoadingBancos ? (
                  <div className="text-center py-8">Carregando...</div>
                ) : errorBancos ? (
                  <p className="text-center text-muted-foreground py-8">
                    Erro ao carregar bancos. Tente novamente.
                  </p>
                ) : (
                  <BancoTable
                    data={bancos}
                    onEdit={handleEditBanco}
                    onDelete={handleDeleteBanco}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="repositorios" className="space-y-4">
            <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Repositórios de Documentos</CardTitle>
                    <CardDescription>
                      Lista de todos os repositórios de documentos cadastrados
                    </CardDescription>
                  </div>
                  <Button className="gap-2" onClick={handleNewRepositorio}>
                    <Plus className="h-4 w-4" />
                    Novo Repositório
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingRepositorios ? (
                  <div className="text-center py-8">Carregando...</div>
                ) : errorRepositorios ? (
                  <p className="text-center text-muted-foreground py-8">
                    Erro ao carregar repositórios. Tente novamente.
                  </p>
                ) : (
                  <RepositorioTable
                    data={repositorios}
                    onEdit={handleEditRepositorio}
                    onDelete={handleDeleteRepositorio}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <SistemaForm open={isSistemaFormOpen} onOpenChange={setIsSistemaFormOpen} sistema={selectedSistema} />
      <BancoForm open={isBancoFormOpen} onOpenChange={setIsBancoFormOpen} banco={selectedBanco} />
      <RepositorioForm open={isRepositorioFormOpen} onOpenChange={setIsRepositorioFormOpen} repositorio={selectedRepositorio} />
    </>
  )
}
