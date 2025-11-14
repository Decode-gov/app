"use client"

import { useState } from "react"
import { Plus, Server, Database, GitBranch, HardDrive } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSistemas, useDeleteSistema } from "@/hooks/api/use-sistemas"
import { useBancos, useDeleteBanco } from "@/hooks/api/use-bancos"
import { SistemaResponse, BancoResponse } from "@/types/api"
import { SistemaForm } from "@/components/sistemas/sistema-form"
import { BancoForm } from "@/components/bancos/banco-form"
import { SistemaTable } from "@/components/sistemas/sistema-table"
import { BancoTable } from "@/components/bancos/banco-table"

export default function AtivosTecnologicosPage() {
  const [page] = useState(1)
  const [limit] = useState(100)
  const [isSistemaFormOpen, setIsSistemaFormOpen] = useState(false)
  const [isBancoFormOpen, setIsBancoFormOpen] = useState(false)
  const [selectedSistema, setSelectedSistema] = useState<SistemaResponse | undefined>()
  const [selectedBanco, setSelectedBanco] = useState<BancoResponse | undefined>()

  const { data: sistemasData, isLoading: isLoadingSistemas, error: errorSistemas } = useSistemas({ page, limit })
  const { data: bancosData, isLoading: isLoadingBancos, error: errorBancos } = useBancos({ page, limit })

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

  const totalSistemas = sistemasData?.total || 0
  const totalBancos = bancosData?.total || 0
  const sistemasComBanco = sistemas.filter(s => s.bancos && s.bancos.length > 0).length
  const sistemasComRepo = sistemas.filter(s => s.repositorio).length

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

          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Com Repositório</CardTitle>
              <div className="p-2 rounded-lg bg-orange-100 group-hover:bg-orange-200 transition-colors duration-300">
                <GitBranch className="h-4 w-4 text-orange-600 transition-colors duration-300" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{sistemasComRepo}</div>
              <p className="text-xs text-muted-foreground">com repositório</p>
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
        </Tabs>
      </div>

      <SistemaForm open={isSistemaFormOpen} onOpenChange={setIsSistemaFormOpen} sistema={selectedSistema} />
      <BancoForm open={isBancoFormOpen} onOpenChange={setIsBancoFormOpen} banco={selectedBanco} />
    </>
  )
}
