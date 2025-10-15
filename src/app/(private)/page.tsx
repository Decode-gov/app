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
  Eye,
  CheckCircle
} from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { StatsCards } from "@/components/ui/stats-cards"

// Mock data - substituir por chamadas reais da API
const mockDashboardData = {
  usuarios: { total: 45, ativos: 42 },
  definicoes: { total: 156, porCategoria: { "Dado bruto": 45, "Dado processado": 67, "Dado interpretado": 33, "Produto": 11 } },
  kpis: { total: 28, porPeriodicidade: { "mensal": 12, "trimestral": 8, "anual": 5, "semanal": 3 } },
  politicas: { total: 18, vigentes: 15, revogadas: 3 },
  comunidades: { total: 8 },
  sistemas: { total: 23 },
  tabelas: { total: 134 },
  processos: { total: 67 }
}

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
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      // Simular chamada da API
      await new Promise(resolve => setTimeout(resolve, 1000))
      return mockDashboardData
    },
  })

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
              value: dashboardData?.usuarios.total || 0,
              description: `${dashboardData?.usuarios.ativos || 0} ativos (${Math.round(((dashboardData?.usuarios.ativos || 0) / (dashboardData?.usuarios.total || 1)) * 100)}%)`,
              icon: Users,
              gradient: "from-blue-500 to-cyan-500",
            },
            {
              title: "Termos/Definições",
              value: dashboardData?.definicoes.total || 0,
              description: "Definições catalogadas",
              icon: BookOpen,
              gradient: "from-green-500 to-emerald-500",
            },
            {
              title: "KPIs",
              value: dashboardData?.kpis.total || 0,
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
              value: dashboardData?.politicas.vigentes || 0,
              description: `${dashboardData?.politicas.total || 0} total (${Math.round(((dashboardData?.politicas.vigentes || 0) / (dashboardData?.politicas.total || 1)) * 100)}% vigentes)`,
              icon: Shield,
              gradient: "from-orange-500 to-red-500",
            },
            {
              title: "Comunidades",
              value: dashboardData?.comunidades.total || 0,
              description: "Domínios de dados",
              icon: Building,
              gradient: "from-indigo-500 to-blue-500",
            },
            {
              title: "Sistemas",
              value: dashboardData?.sistemas.total || 0,
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
              value: dashboardData?.tabelas.total || 0,
              description: "Mapeamentos técnicos",
              icon: FileText,
              gradient: "from-yellow-500 to-orange-500",
            },
            {
              title: "Processos",
              value: dashboardData?.processos.total || 0,
              description: "Processos de negócio",
              icon: Activity,
              gradient: "from-pink-500 to-rose-500",
            },
            {
              title: "Total de Elementos",
              value: (dashboardData?.usuarios.total || 0) + (dashboardData?.definicoes.total || 0) + (dashboardData?.kpis.total || 0) + (dashboardData?.politicas.total || 0) + (dashboardData?.comunidades.total || 0) + (dashboardData?.sistemas.total || 0) + (dashboardData?.tabelas.total || 0) + (dashboardData?.processos.total || 0),
              description: "Elementos no sistema",
              icon: CheckCircle,
              gradient: "from-violet-500 to-purple-500",
            },
          ]}
          animationDirection="right"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <MetricCard
          title="Definições por Categoria"
          data={dashboardData?.definicoes.porCategoria || {}}
          icon={Eye}
          description="Distribuição dos termos por categoria"
        />

        <MetricCard
          title="KPIs por Periodicidade"
          data={dashboardData?.kpis.porPeriodicidade || {}}
          icon={CheckCircle}
          description="Distribuição dos KPIs por frequência"
        />
      </div>
    </div>
  )
}
