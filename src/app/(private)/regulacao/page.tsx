"use client"

import { useState } from "react"
import { Plus, FileText, Search, Edit, Trash2, Eye, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
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
import { useRegulacoes, useDeleteRegulacao } from "@/hooks/api/use-regulacao"
import { RegulacaoForm } from "@/components/regulacao/regulacao-form"
import { RegulacaoResponse } from "@/types/api"

export default function RegulacaoPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [page] = useState(1)
  const [limit] = useState(10)
  const [formOpen, setFormOpen] = useState(false)
  const [selectedRegulacao, setSelectedRegulacao] = useState<RegulacaoResponse | undefined>()

  const { data: regulacoesData, isLoading, error } = useRegulacoes({
    page,
    limit,
    search: searchTerm,
  })
  const deleteRegulacao = useDeleteRegulacao()

  const regulacoes = regulacoesData?.data ?? []

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta regulação?")) {
      await deleteRegulacao.mutateAsync(id)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Regulação
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie regulamentações e normativas aplicáveis
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[60px] mb-2" />
                <Skeleton className="h-3 w-[120px]" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-[300px]" />
              <Skeleton className="h-10 w-[100px]" />
            </div>
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-destructive">
            Regulação
          </h1>
          <p className="text-muted-foreground mt-2">
            Erro ao carregar regulações
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Regulação
        </h1>
        <p className="text-muted-foreground mt-2">
          Gerencie regulamentações e normativas aplicáveis no sistema DECODE-GOV
        </p>
      </div>

      {/* Card de estatística */}
      <Card className="group hover:shadow-lg transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Regulações</CardTitle>
          <div className="p-2 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors duration-300">
            <FileText className="h-4 w-4 text-blue-600 transition-colors duration-300" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {regulacoes.length}
          </div>
          <p className="text-xs text-muted-foreground">regulações cadastradas</p>
        </CardContent>
      </Card>

      {/* Tabela de dados */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Regulações</CardTitle>
              <CardDescription>
                Lista de todas as regulações cadastradas
              </CardDescription>
            </div>
            <Button className="gap-2" onClick={() => {
              setSelectedRegulacao(undefined)
              setFormOpen(true)
            }}>
              <Plus className="h-4 w-4" />
              Nova Regulação
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar regulações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Epígrafe</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Órgão Regulador</TableHead>
                  <TableHead>Vigência</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead className="w-[70px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {regulacoes.map((regulacao) => (
                  <TableRow key={regulacao.id}>
                    <TableCell className="font-medium">
                      {regulacao.epigrafe}
                    </TableCell>
                    <TableCell className="max-w-[300px]">
                      <div className="truncate" title={regulacao.nome}>
                        {regulacao.nome}
                      </div>
                    </TableCell>
                    <TableCell>
                      {regulacao.orgaoRegulador || '-'}
                    </TableCell>
                    <TableCell>
                      {regulacao.vigencia 
                        ? new Date(regulacao.vigencia).toLocaleDateString('pt-BR')
                        : '-'
                      }
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(regulacao.createdAt).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setSelectedRegulacao(regulacao as RegulacaoResponse)
                            setFormOpen(true)
                          }}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDelete(regulacao.id)}
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
        </CardContent>
      </Card>

      {/* Formulário de Criação/Edição */}
      <RegulacaoForm 
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open)
          if (!open) {
            setSelectedRegulacao(undefined)
          }
        }}
        regulacao={selectedRegulacao}
      />
    </div>
  )
}