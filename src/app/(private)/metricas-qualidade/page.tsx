"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, BarChart3, Activity } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { useDimensoesQualidade } from "@/hooks/api/use-dimensoes-qualidade-new"
import { useRegrasQualidade } from "@/hooks/api/use-regras-qualidade"

export default function MetricasQualidadePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [page] = useState(1)
  const [limit] = useState(10)
  
  const { data: dimensoesData, isLoading: isLoadingDimensoes, error: errorDimensoes } = useDimensoesQualidade({
    page,
    limit,
    search: searchTerm,
  })

  const { data: regrasData, isLoading: isLoadingRegras, error: errorRegras } = useRegrasQualidade({
    page,
    limit,
    search: searchTerm,
  })

  const dimensoes = dimensoesData?.data ?? []
  const regras = regrasData?.data ?? []
  const isLoading = isLoadingDimensoes || isLoadingRegras
  const error = errorDimensoes || errorRegras

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Métricas de Qualidade
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitore indicadores e métricas da qualidade dos dados
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-[120px]" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[60px] mb-2" />
                <Skeleton className="h-3 w-[140px]" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardContent className="space-y-4 pt-6">
            <Skeleton className="h-10 w-[300px]" />
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
            Métricas de Qualidade
          </h1>
          <p className="text-muted-foreground mt-2">
            Erro ao carregar métricas de qualidade
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Métricas de Qualidade
        </h1>
        <p className="text-muted-foreground mt-2">
          Monitore indicadores e métricas da qualidade dos dados no sistema DECODE-GOV
        </p>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Dimensões</CardTitle>
            <div className="p-2 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors duration-300">
              <BarChart3 className="h-4 w-4 text-blue-600 transition-colors duration-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {dimensoes.length}
            </div>
            <p className="text-xs text-muted-foreground">dimensões cadastradas</p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Regras</CardTitle>
            <div className="p-2 rounded-lg bg-green-100 group-hover:bg-green-200 transition-colors duration-300">
              <Activity className="h-4 w-4 text-green-600 transition-colors duration-300" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {regras.length}
            </div>
            <p className="text-xs text-muted-foreground">regras de qualidade</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Dimensões */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-lg">
        <CardHeader>
          <CardTitle>Dimensões de Qualidade</CardTitle>
          <CardDescription>
            Lista de todas as dimensões de qualidade cadastradas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar dimensões..."
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
                  <TableHead>Nome</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Criado em</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingDimensoes ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[250px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                    </TableRow>
                  ))
                ) : errorDimensoes ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                      Erro ao carregar dimensões. Tente novamente.
                    </TableCell>
                  </TableRow>
                ) : dimensoes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                      Nenhuma dimensão encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  dimensoes.map((dimensao) => (
                    <TableRow key={dimensao.id}>
                      <TableCell className="font-medium">{dimensao.nome}</TableCell>
                      <TableCell className="max-w-[300px]">
                        <div className="truncate" title={dimensao.descricao}>
                          {dimensao.descricao}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(dimensao.createdAt).toLocaleDateString('pt-BR')}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Regras */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-lg">
        <CardHeader>
          <CardTitle>Regras de Qualidade</CardTitle>
          <CardDescription>
            Lista de todas as regras de qualidade cadastradas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Dimensão</TableHead>
                  <TableHead>Criado em</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingRegras ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-[250px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                    </TableRow>
                  ))
                ) : errorRegras ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                      Erro ao carregar regras. Tente novamente.
                    </TableCell>
                  </TableRow>
                ) : regras.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                      Nenhuma regra encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  regras.map((regra) => (
                    <TableRow key={regra.id}>
                      <TableCell className="font-medium max-w-[300px]">
                        <div className="truncate" title={regra.descricao}>
                          {regra.descricao}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{regra.dimensaoId}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {regra.createdAt ? new Date(regra.createdAt).toLocaleDateString('pt-BR') : '-'}
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
  )
}