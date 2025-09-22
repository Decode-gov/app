"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
    Plus,
    Search,
    MoreHorizontal,
    Eye,
    Edit,
    Trash2,
    BarChart3,
    TrendingUp,
    TrendingDown,
    Target,
    Filter
} from "lucide-react"

// Mock data
const mockKpis = [
  { 
    id: "1", 
    nome: "Taxa de Qualidade dos Dados", 
    categoria: "Qualidade", 
    valor: 95.5, 
    meta: 98, 
    tendencia: "up",
    unidade: "%",
    dataColeta: "2024-01-15",
    responsavel: "João Silva"
  },
  { 
    id: "2", 
    nome: "Tempo de Processamento ETL", 
    categoria: "Performance", 
    valor: 45, 
    meta: 30, 
    tendencia: "down",
    unidade: "min",
    dataColeta: "2024-01-15",
    responsavel: "Maria Santos"
  },
  { 
    id: "3", 
    nome: "Disponibilidade do Sistema", 
    categoria: "Disponibilidade", 
    valor: 99.9, 
    meta: 99.5, 
    tendencia: "up",
    unidade: "%",
    dataColeta: "2024-01-15",
    responsavel: "Pedro Costa"
  },
  { 
    id: "4", 
    nome: "Conformidade LGPD", 
    categoria: "Compliance", 
    valor: 88.2, 
    meta: 95, 
    tendencia: "up",
    unidade: "%",
    dataColeta: "2024-01-15",
    responsavel: "Ana Ferreira"
  },
]

export default function KpisPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategoria, setSelectedCategoria] = useState<string | null>(null)

  const filteredKpis = mockKpis.filter(kpi => {
    const matchesSearch = kpi.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         kpi.responsavel.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategoria = !selectedCategoria || kpi.categoria === selectedCategoria
    return matchesSearch && matchesCategoria
  })

  const categoriaStats = {
    total: mockKpis.length,
    acimaDaMeta: mockKpis.filter(k => k.valor >= k.meta).length,
    abaixoDaMeta: mockKpis.filter(k => k.valor < k.meta).length
  }

  const getStatusBadge = (valor: number, meta: number) => {
    if (valor >= meta) {
      return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">Dentro da Meta</Badge>
    } else if (valor >= meta * 0.9) {
      return <Badge variant="outline" className="border-yellow-300 text-yellow-700">Atenção</Badge>
    } else {
      return <Badge variant="destructive">Abaixo da Meta</Badge>
    }
  }

  const getTrendIcon = (tendencia: string) => {
    return tendencia === "up" ? (
      <TrendingUp className="h-4 w-4 text-emerald-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-500" />
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-4xl font-bold tracking-tight text-gradient">
          Indicadores de Performance (KPIs)
        </h1>
        <p className="text-muted-foreground mt-2">
          Monitore os principais indicadores de governança de dados
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3 animate-slide-in-right">
        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de KPIs</CardTitle>
            <BarChart3 className="h-4 w-4 text-primary group-hover:scale-110 transition-transform duration-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{categoriaStats.total}</div>
            <p className="text-xs text-muted-foreground">
              Indicadores monitorados
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dentro da Meta</CardTitle>
            <Target className="h-4 w-4 text-emerald-500 group-hover:scale-110 transition-transform duration-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{categoriaStats.acimaDaMeta}</div>
            <p className="text-xs text-muted-foreground">
              {((categoriaStats.acimaDaMeta / categoriaStats.total) * 100).toFixed(0)}% do total
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Abaixo da Meta</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500 group-hover:scale-110 transition-transform duration-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{categoriaStats.abaixoDaMeta}</div>
            <p className="text-xs text-muted-foreground">
              {((categoriaStats.abaixoDaMeta / categoriaStats.total) * 100).toFixed(0)}% do total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Actions and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center animate-slide-in-left">
        <div className="flex flex-1 gap-2 max-w-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar KPIs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background/50 backdrop-blur-sm border-border/60 focus:border-primary/50 transition-colors duration-200"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 bg-background/50 backdrop-blur-sm border-border/60 hover:bg-accent/50">
                <Filter className="h-4 w-4" />
                Categoria
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSelectedCategoria(null)}>
                Todas
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedCategoria("Qualidade")}>
                Qualidade
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedCategoria("Performance")}>
                Performance
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedCategoria("Disponibilidade")}>
                Disponibilidade
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedCategoria("Compliance")}>
                Compliance
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex gap-2">
          <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-200">
            <Plus className="h-4 w-4" />
            Novo KPI
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card className="animate-fade-in glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Indicadores de Performance
          </CardTitle>
          <CardDescription>
            Lista de todos os KPIs e suas métricas atuais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border/60">
                <TableHead>Nome do KPI</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Valor Atual</TableHead>
                <TableHead>Meta</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tendência</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredKpis.map((kpi, index) => (
                <TableRow 
                  key={kpi.id} 
                  className="border-border/60 hover:bg-muted/50 transition-colors duration-200 group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <TableCell className="font-medium group-hover:text-primary transition-colors duration-200">
                    {kpi.nome}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {kpi.categoria}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">{kpi.valor}</span>
                      <span className="text-muted-foreground text-sm">{kpi.unidade}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span>{kpi.meta}</span>
                      <span className="text-muted-foreground text-sm">{kpi.unidade}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(kpi.valor, kpi.meta)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(kpi.tendencia)}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {kpi.responsavel}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          className="h-8 w-8 p-0 hover:bg-accent/50 transition-colors duration-200"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="glass">
                        <DropdownMenuItem className="gap-2 hover:bg-accent/50">
                          <Eye className="h-4 w-4" />
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 hover:bg-accent/50">
                          <Edit className="h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-red-600 hover:bg-red-50 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
