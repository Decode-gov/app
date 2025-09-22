"use client"

import { Tag, CheckCircle, FileText, Shield } from "lucide-react"
import { type ClassificacaoStats } from "@/types/classificacao"
import { StatsCards, type StatsCard } from "@/components/ui/stats-cards"

interface ClassificacaoStatsCardsProps {
  stats: ClassificacaoStats
}

export function ClassificacaoStatsCards({ stats }: ClassificacaoStatsCardsProps) {
  // Calcular política com mais classificações
  const politicaComMaisClassificacoes = Object.entries(stats.porPolitica)
    .reduce((max, [politicaId, count]) => count > max.count ? { politicaId, count } : max, 
           { politicaId: "", count: 0 })

  const cards: StatsCard[] = [
    {
      title: "Total de Classificações",
      value: stats.total,
      description: "Classificações cadastradas",
      icon: Tag,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Classificações Ativas", 
      value: stats.ativos,
      description: "Todas as classificações estão ativas",
      icon: CheckCircle,
      gradient: "from-green-500 to-emerald-500",
    },
    {
      title: "Políticas Utilizadas",
      value: Object.keys(stats.porPolitica).length,
      description: "Políticas com classificações",
      icon: Shield,
      gradient: "from-purple-500 to-violet-500",
    },
    {
      title: "Maior Uso",
      value: politicaComMaisClassificacoes.count,
      description: "Classificações em uma política",
      icon: FileText,
      gradient: "from-orange-500 to-amber-500",
    },
  ]

  return <StatsCards cards={cards} animationDirection="left" />
}
