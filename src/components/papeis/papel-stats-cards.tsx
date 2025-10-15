"use client"

import { Users, FileText, Activity, TrendingUp } from "lucide-react"
import { type PapelStats } from "@/types/papel"
import { StatsCards, type StatsCard } from "@/components/ui/stats-cards"

interface PapelStatsCardsProps {
  stats: PapelStats
}

export function PapelStatsCards({ stats }: PapelStatsCardsProps) {
  // Calcular política com mais papéis
  const politicaComMaisPapeis = Object.entries(stats.porPolitica)
    .reduce((max, [politicaId, count]) => count > max.count ? { politicaId, count } : max, 
           { politicaId: "", count: 0 })

  const cards: StatsCard[] = [
    {
      title: "Total de Papéis",
      value: stats.total,
      description: "Papéis cadastrados",
      icon: Users,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Papéis Ativos",
      value: stats.ativos,
      description: "Em uso no sistema",
      icon: Activity,
      gradient: "from-green-500 to-emerald-500",
    },
    {
      title: "Papéis Inativos",
      value: stats.inativos,
      description: "Desabilitados",
      icon: FileText,
      gradient: "from-orange-500 to-amber-500",
    },
    {
      title: "Maior Uso",
      value: politicaComMaisPapeis.count,
      description: "Papéis em uma política",
      icon: TrendingUp,
      gradient: "from-purple-500 to-violet-500",
    },
  ]

  return <StatsCards cards={cards} animationDirection="left" />
}