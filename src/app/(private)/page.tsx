"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Users,
  BookOpen,
  BarChart3,
  Shield,
  Building,
  Database,
  FileText,
  Activity,
  Columns,
  FolderOpen
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { StatsCards } from "@/components/ui/stats-cards"
import { useDashboardMetricas } from "@/hooks/api/use-dashboard"

function MetricCard({
  title,
  data,
  icon: Icon,
  description
}: {
  title: string
  data: Record<string, number>
  icon: React.ComponentType<{ className?: string }>
  description: string
}) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors duration-300">
            <Icon className="h-5 w-5 text-accent group-hover:text-accent-foreground transition-colors duration-300" />
          </div>
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Object.entries(data).map(([categoria, quantidade]) => (
            <div key={categoria} className="flex items-center justify-between group/item">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary/60 group-hover/item:bg-primary transition-colors duration-200" />
                <span className="text-sm font-medium group-hover/item:text-primary transition-colors duration-200">{categoria}</span>
              </div>
              <Badge variant="outline" className="group-hover/item:border-primary/50 transition-colors duration-200">
                {quantidade}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  const { data: dashboardData, isLoading, error } = useDashboardMetricas()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Visão geral do sistema DECODE-GOV de governança de dados
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[60px] mb-2" />
                <Skeleton className="h-3 w-[120px] mb-2" />
                <Skeleton className="h-5 w-[80px]" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="animate-pulse">
            <CardHeader>
              <Skeleton className="h-6 w-[180px]" />
              <Skeleton className="h-4 w-[220px]" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Skeleton className="h-4 w-[120px]" />
                    <Skeleton className="h-6 w-[40px]" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="animate-pulse">
            <CardHeader>
              <Skeleton className="h-6 w-[160px]" />
              <Skeleton className="h-4 w-[200px]" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Skeleton className="h-4 w-[100px]" />
                    <Skeleton className="h-6 w-[30px]" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-destructive">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Erro ao carregar dados do dashboard
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="animate-fade-in">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Visão geral do sistema DECODE-GOV de governança de dados
        </p>
      </div>

      {/* Primeira linha de cards principais */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-foreground">Métricas Principais</h2>
        <StatsCards 
          cards={[
            {
              title: "Usuários",
              value: dashboardData?.totalUsuarios || 0,
              description: "Usuários cadastrados no sistema",
              icon: Users,
              gradient: "from-blue-500 to-cyan-500",
            },
            {
              title: "Termos/Definições",
              value: dashboardData?.totalTermos || 0,
              description: "Definições catalogadas",
              icon: BookOpen,
              gradient: "from-green-500 to-emerald-500",
            },
            {
              title: "KPIs",
              value: dashboardData?.totalKpis || 0,
              description: "Indicadores definidos",
              icon: BarChart3,
              gradient: "from-purple-500 to-pink-500",
            },
          ]}
          animationDirection="right"
        />
      </div>

      {/* Segunda linha de cards secundários */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-foreground">Estruturas e Políticas</h2>
        <StatsCards 
          cards={[
            {
              title: "Políticas",
              value: dashboardData?.totalPoliticas || 0,
              description: "Políticas internas do sistema",
              icon: Shield,
              gradient: "from-orange-500 to-red-500",
            },
            {
              title: "Entidades",
              value: dashboardData?.totalEntidades || 0,
              description: "Total de entidades cadastradas",
              icon: Building,
              gradient: "from-indigo-500 to-blue-500",
            },
            {
              title: "Sistemas",
              value: dashboardData?.totalSistemas || 0,
              description: "Sistemas cadastrados",
              icon: Database,
              gradient: "from-teal-500 to-cyan-500",
            },
          ]}
          animationDirection="left"
        />
      </div>

      {/* Terceira linha de cards técnicos */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-foreground">Recursos Técnicos</h2>
        <StatsCards 
          cards={[
            {
              title: "Tabelas",
              value: dashboardData?.totalTabelas || 0,
              description: "Mapeamentos técnicos",
              icon: FileText,
              gradient: "from-yellow-500 to-orange-500",
            },
            {
              title: "Colunas",
              value: dashboardData?.totalColunas || 0,
              description: "Colunas mapeadas",
              icon: Columns,
              gradient: "from-pink-500 to-rose-500",
            },
            {
              title: "Processos",
              value: dashboardData?.totalProcessos || 0,
              description: "Processos de negócio",
              icon: Activity,
              gradient: "from-cyan-500 to-blue-500",
            },
          ]}
          animationDirection="right"
        />
      </div>

      {/* Cards detalhados */}
      <div className="grid gap-6 md:grid-cols-2">
        <MetricCard
          title="Documentos por Categoria"
          data={{
            "Documentos Totais": dashboardData?.totalDocumentos || 0,
            "Políticas": dashboardData?.totalPoliticas || 0,
            "Processos": dashboardData?.totalProcessos || 0,
          }}
          icon={FolderOpen}
          description="Distribuição dos documentos por categoria"
        />

        <MetricCard
          title="Estrutura de Dados"
          data={{
            "Tabelas": dashboardData?.totalTabelas || 0,
            "Colunas": dashboardData?.totalColunas || 0,
            "Sistemas": dashboardData?.totalSistemas || 0,
          }}
          icon={Database}
          description="Estrutura técnica do sistema"
        />
      </div>
    </div>
  )
}