"use client"

import { FileText, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { type PoliticaStats } from "@/types/politica"
import { StatsCards, type StatsCard } from "@/components/ui/stats-cards"

interface PoliticaStatsCardsProps {
  stats: PoliticaStats
}

export function PoliticaStatsCards({ stats }: PoliticaStatsCardsProps) {
  // Calcular categoria com mais políticas
  const categoriaComMaisPoliticas = Object.entries(stats.porCategoria)
    .reduce((max, [categoria, count]) => count > max.count ? { categoria, count } : max, 
           { categoria: "", count: 0 })

  const cards: StatsCard[] = [
    {
      title: "Total de Políticas",
      value: stats.total,
      description: "Políticas cadastradas",
      icon: FileText,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Políticas Vigentes",
      value: stats.vigentes,
      description: "Ativas no sistema",
      icon: CheckCircle,
      gradient: "from-green-500 to-emerald-500",
    },
    {
      title: "Em Elaboração",
      value: stats.emElaboracao,
      description: "Sendo desenvolvidas",
      icon: Clock,
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      title: "Maior Categoria",
      value: categoriaComMaisPoliticas.count,
      description: `${categoriaComMaisPoliticas.categoria || "Nenhuma"}`,
      icon: AlertCircle,
      gradient: "from-purple-500 to-violet-500",
    },
  ]

  return <StatsCards cards={cards} animationDirection="left" />
}