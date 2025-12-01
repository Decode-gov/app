"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Database } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useColunas } from "@/hooks/api/use-colunas"
import { useTabelas } from "@/hooks/api/use-tabelas"
import { ColunaResponse, TabelaResponse } from "@/types/api"
import { ColunaForm } from "@/components/colunas/coluna-form"
import { TabelaForm } from "@/components/tabelas/tabela-form"
import { DataTableTabelas } from "@/components/tabelas/data-table-tabelas"
import { DataTableColunas } from "@/components/colunas/data-table-colunas"

export default function TabelasColunasPage() {
  const [isColunaFormOpen, setIsColunaFormOpen] = useState(false)
  const [isTabelaFormOpen, setIsTabelaFormOpen] = useState(false)
  const [selectedColuna, setSelectedColuna] = useState<ColunaResponse | undefined>()
  const [selectedTabela, setSelectedTabela] = useState<TabelaResponse | undefined>()
  const [preSelectedTabelaId, setPreSelectedTabelaId] = useState<string | undefined>()

  const { data: colunasData } = useColunas({ page: 1, limit: 1000 })
  const { data: tabelasData } = useTabelas({ page: 1, limit: 1000 })

  const handleEditColuna = (coluna: ColunaResponse) => {
    setSelectedColuna(coluna)
    setPreSelectedTabelaId(undefined)
    setIsColunaFormOpen(true)
  }

  const handleNewColuna = () => {
    setSelectedColuna(undefined)
    setPreSelectedTabelaId(undefined)
    setIsColunaFormOpen(true)
  }

  const handleAddColunaToTabela = (tabela: TabelaResponse) => {
    setSelectedColuna(undefined)
    setPreSelectedTabelaId(tabela.id)
    setIsColunaFormOpen(true)
  }

  const handleEditTabela = (tabela: TabelaResponse) => {
    setSelectedTabela(tabela)
    setIsTabelaFormOpen(true)
  }

  const handleNewTabela = () => {
    setSelectedTabela(undefined)
    setIsTabelaFormOpen(true)
  }

  const colunas = colunasData?.data || []
  const tabelas = tabelasData?.data || []

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

        <div className="grid gap-4 md:grid-cols-2">
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
              <div className="text-2xl font-bold text-blue-600">{colunas.length || 0}</div>
              <p className="text-xs text-muted-foreground">colunas mapeadas</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-lg">
          <Tabs defaultValue="tabelas" className="w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <TabsList className="grid w-full md:w-[400px] grid-cols-2 bg-foreground/10">
                  <TabsTrigger value="tabelas">Tabelas</TabsTrigger>
                  <TabsTrigger value="colunas">Colunas</TabsTrigger>
                </TabsList>
              </div>
            </CardHeader>
            <CardContent>
              <TabsContent value="tabelas" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Tabelas Mapeadas</CardTitle>
                    <CardDescription>
                      Lista de todas as tabelas cadastradas
                    </CardDescription>
                  </div>
                  <Button className="gap-2" onClick={handleNewTabela}>
                    <Plus className="h-4 w-4" />
                    Nova Tabela
                  </Button>
                </div>
                <DataTableTabelas 
                  data={tabelas} 
                  onEdit={handleEditTabela}
                  onAddColuna={handleAddColunaToTabela}
                />
              </TabsContent>

              <TabsContent value="colunas" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Colunas Mapeadas</CardTitle>
                    <CardDescription>
                      Lista de todas as colunas cadastradas
                    </CardDescription>
                  </div>
                  <Button className="gap-2" onClick={handleNewColuna}>
                    <Plus className="h-4 w-4" />
                    Nova Coluna
                  </Button>
                </div>
                <DataTableColunas 
                  data={colunas} 
                  onEdit={handleEditColuna}
                />
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>

      <ColunaForm 
        open={isColunaFormOpen} 
        onOpenChange={setIsColunaFormOpen} 
        coluna={selectedColuna}
        preSelectedTabelaId={preSelectedTabelaId}
      />
      <TabelaForm 
        open={isTabelaFormOpen} 
        onOpenChange={setIsTabelaFormOpen} 
        tabela={selectedTabela} 
      />
    </>
  )
}
